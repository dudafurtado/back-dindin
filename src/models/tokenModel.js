const connection = require('../database/connection');

const tokenExists = async ({ jwtID }) => {
    const { rowCount } = await connection('select id from users where id = $1', [jwtID]);
    return rowCount;
}

module.exports = {
    tokenExists
}