const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const conexao = require('../database/conexao');

const authorizationToken = async (req, res, next) => {
    const Authorization = req.header('Authorization');
    const token = Authorization.replace('Bearer', "").trim();
    if (!token) {
        return res.status(400).json("É preciso ter uma conta para ver as transações");
    }
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);
    
    try {
        const idOfUserExists = await conexao.query('select id from usuarios where id = $1', [jwtID]);
        if (idOfUserExists.rowCount === 0) {
            return res.status(400).json('O token é inválido');
        }
        next()
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { authorizationToken };