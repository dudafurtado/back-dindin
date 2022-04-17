const conexao = require('../database/conexao');

const listingAllTheCategories = async (req, res) => {
    try {
        const { rows } = await conexao.query('select * from categorias');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listingAllTheCategories
};