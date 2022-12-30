const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const CircularJSON = require('circular-json');
const cors = require("cors");
dotenv.config({ path: './config.env' })
const pool = require("./db");
const { response } = require("express");
const validationerror = require("./validationError");


const app = express();
// 1) MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(req.headers);
    next();
});

//routes


app.get("/wazirx/results",async (req, res, next) => {
    try {
        await axios.get("https://api.wazirx.com/api/v2/tickers").then(async (response) => { 
            //for every refresh this api should be feteched
            // deleting all the elements from the table before feeding with new set of data
            //when user request for new data delete the data in table
            const deleteAll = await pool.query("TRUNCATE coindetails")
            //unzipping the circulat JSON response
            const str = CircularJSON.stringify(response);
            res_data = JSON.parse(str)
        
            obj = res_data.data;
            count = 0
            for(data in obj) {
                //insert top 10 data in the database
                if(count == 10){
                    break;
                }
                console.log(count,obj[data].name);
                addCoin = await pool
                .query("INSERT INTO coindetails (coin_name,last_price,"+
                    "buy_price,sell_price,volume,base_unit) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
                    [obj[data].name,obj[data].last,obj[data].buy,obj[data].sell,obj[data].volume,obj[data].base_unit])
                    count += 1;
            }
            
        res.json("Done pushing data");
        }).catch((err) => {
            console.log(err.message);
            res.status(400).json({
                status: 400,
                message: error.message
            });
            
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
   
    next();
});



//create a coindetail
// app.post("/addcoin", async (req, res, next) => {
//     try {
//         console.log(req.body);
//         const description = req.body.description;
//         const newCoin = await pool
//             .query("INSERT INTO coindetails (description) VALUES($1) RETURNING *",
//                 [description])
//         res.json(newCoin);
//     } catch (error) {
//         console.log(error.message);
//     }
//     next();
// })


//get all coins
app.get('/getallcoins', async (req, res, next) => {
    try {
        const allcoins = await pool.query("SELECT * FROM coindetails");
        res.json(allcoins);
        // res.json(response_data);
    } catch (error) {
            console.log(error.message);
            res.status(400).json({
                status: 400,
                message: error.message
            });
    }

    next();
})

//get a coin with their base_name
app.get('/coins/:name', async (req, res, next) => {
    try {
        const name = req.params.name;
        const coin = await pool.query("SELECT * FROM coindetails WHERE base_unit = $1",
            [name]);
        res.json(coin.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }

    next();
})
//update a coin
// app.put("/updatecoins/:name", async (req, res, next) => {
//     try {
//         const id = req.params.name;
//         const description = req.body.description;
//         const updateCoin = await pool.query("UPDATE coindetails SET description  = $1 WHERE coin_id = $2",
//             [description, id]);
//         res.json("Coin was updated");
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).json({
//             status: 400,
//             message: error.message
//         });
//     }
//     next();
// })

//delete a coin
app.delete("/coins/delete/:name", async (req, res, next) => {
    try {
        const name = req.params.name;
        const deleteCoin = await pool.query("DELETE FROM coindetails WHERE base_unit =$1",
            [name])
        res.json("coin deleted");
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
    next();
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

// module.exports = app;