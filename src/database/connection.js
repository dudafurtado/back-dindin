const { Pool } = require('pg');

const pool = new Pool({
    user: 'xnonowofkrhunx',
    host: 'ec2-18-204-142-254.compute-1.amazonaws.com',
    database: 'd7s80c6dgfnpsd',
    password: '49a024242552662f2901bbecb777a8374c113b75f37260148c9ea43a6be233bf',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = { query }