const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { query }