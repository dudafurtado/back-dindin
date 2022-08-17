const connection = require('../database/connection');

const allCategories = async () => {
    const { rows } = await connection('select * from categories');
    return rows;
}

const categoryExists = async ({ categoria_id }) => {
    const { rowCount } = await connection('select * from categories where id = $1', [categoria_id]);
    return rowCount;
}

module.exports = {
    allCategories,
    categoryExists,
}