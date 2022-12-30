CREATE DATABASE intern;

CREATE TABLE coindetails (
    coin_id SERIAL PRIMARY KEY,
    coin_name VARCHAR(255) NOT NULL,
    last_price double NOT NULL,
    buy_price double NOT NULL,
    sell_price double NOT NULL,
    volume double NOT NULL,
    base_unit double NOT NULL
);