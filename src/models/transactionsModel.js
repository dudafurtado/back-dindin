const conexao = require('../database/connection');

const accountStatement = async () => {
    const { rows: typeEntrance } = await conexao.query('select sum(valor) from transacoes where tipo = $1', 
    ['entrada']);
    const sumEntrance = typeEntrance[0].sum;

    const { rows: typeExit } = await conexao.query('select sum(valor) from transacoes where tipo = $1', 
    ['saida']);
    const sumExit = typeExit[0].sum;

    return { sumEntrance, sumExit };
}

const transactionsByUserID = async ({ jwtID }) => {
    const { rows } = await conexao.query('select * from transacoes where usuario_id = $1', [jwtID]);
    return rows;
}

const transactionByID = async ({ paramsID, jwtID }) => {
    const { rowCount, rows } = await conexao.query('select * from transacoes where id = $1 and usuario_id = $2', 
    [paramsID, jwtID]);
    return { rowCount, rows };
}

const addTransaction = async ({ descricao, valor, data, categoria_id, jwtID, tipo }) => {
    const query = 'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6)';
    await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo]);
} 

const updateTransaction = async ({ descricao, valor, data, categoria_id, jwtID, tipo, paramsID }) => {
    const query = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, usuario_id = $5, tipo = $6 where id = $7';
    await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo, paramsID]); 
}

const deleteTransaction = async ({ paramsID, jwtID }) => {
    await conexao.query('delete from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);
}

module.exports = {
    accountStatement,
    transactionsByUserID,
    transactionByID,
    addTransaction,
    updateTransaction,
    deleteTransaction
}