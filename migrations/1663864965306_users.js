/* eslint-disable camelcase */

const { sql } = require("node-pg-migrate/dist/operations/other");

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
       CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         name VARCHAR(30) NOT NULL,
         email VARCHAR(30) NOT NULL, 
         password VARCHAR(30) NOT NULL,
         createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
       )
    `)
};

exports.down = pgm => {
    sql.sql(`DROP TABLE users`)
};
