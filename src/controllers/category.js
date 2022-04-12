const conexao = require('../database/conexao');

const listingAllTheCategories = async (req, res) => {
    try {

    } catch(error) {
        res.status(400).json(error.message)
    }
};

module.exports = {
    listingAllTheCategories
};