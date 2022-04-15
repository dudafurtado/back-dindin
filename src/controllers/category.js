const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');
const conexao = require('../database/conexao');

const listingAllTheCategories = async (req, res) => {
    try {
        const list = await conexao.query('select * from categorias');
        return res.status(200).json(list.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userCategory = async (req, res) => {

    const { usuarios } = req;

    try {
        const list = await conexao.query('select * from categorias whare id = $1', [usuarios.id]);
        return res.status(200).json(list.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};
module.exports = {
    listingAllTheCategories,
    userCategory
};