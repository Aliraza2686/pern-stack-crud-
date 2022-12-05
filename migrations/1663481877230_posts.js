/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        body VARCHAR(500) NOT NULL,
        completed BOOLEAN NOT NULL,
        createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
};

exports.down = pgm => {
    pgm.sql(`DROP TABLE posts`)
};
