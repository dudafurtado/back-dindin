const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    ssl: {
      rejectUnauthorized: false
    }
});

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = { query }