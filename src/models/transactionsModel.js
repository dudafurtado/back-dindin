const connection = require('../database/connection');

const accountStatement = async () => {
    const { rows: typeEntrance } = await connection('select sum(value) from transactions where type = $1', 
    ['entrada']);
    const sumEntrance = typeEntrance[0].sum;

    const { rows: typeExit } = await connection('select sum(value) from transactions where type = $1', 
    ['saida']);
    const sumExit = typeExit[0].sum;

    return { sumEntrance, sumExit };
}

const transactionsByUserID = async ({ jwtID }) => {
    const { rows } = await connection('select * from transactions where user_id = $1', [jwtID]);
    return rows;
}

const transactionByID = async ({ paramsID, jwtID }) => {
    const { rowCount, rows } = await connection('select * from transactions where id = $1 and user_id = $2', 
    [paramsID, jwtID]);
    return { rowCount, rows };
}

const addTransaction = async ({ description, value, date, category_id, jwtID, type }) => {
    const query = 'insert into transactions (description, value, date, category_id, jwtID, type) values ($1, $2, $3, $4, $5, $6)';
    await connection(query, [description, value, date, category_id, jwtID, type]);
} 
description, value, date, category_id, jwtID, type, paramsID
const updateTransaction = async ({ description, value, date, category_id, jwtID, type, paramsID }) => {
    const query = 'update transactions set description = $1, value = $2, date = $3, category_id = $4, user_id = $5, type = $6 where id = $7';
    await connection(query, [description, value, date, category_id, jwtID, type, paramsID]); 
}

const deleteTransaction = async ({ paramsID, jwtID }) => {
    await connection('delete from transactions where id = $1 and user_id = $2', [paramsID, jwtID]);
}

module.exports = {
    accountStatement,
    transactionsByUserID,
    transactionByID,
    addTransaction,
    updateTransaction,
    deleteTransaction
}