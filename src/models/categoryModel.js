const conexao = require('../database/connection');

const allCategories = async () => {
    const { rows } = await conexao.query('select * from categorias');
    return rows;
}

const categoryExists = async ({ categoria_id }) => {
    const { rowCount } = await conexao.query('select * from categorias where id = $1', [categoria_id]);
    return rowCount;
}

module.exports = {
    allCategories,
    categoryExists,
}