const conexao = require('../database/connection');

const tokenExists = async ({ jwtID }) => {
    const { rowCount } = await conexao.query('select id from usuarios where id = $1', [jwtID]);
    return rowCount;
}

module.exports = {
    tokenExists
}