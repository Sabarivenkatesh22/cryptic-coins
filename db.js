const Pool = require('pg').Pool;
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });

const pool = new Pool({
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    port:process.env.DATABASE_PORT,
    database:process.env.DATABASE_NAME
});

module.exports = pool;