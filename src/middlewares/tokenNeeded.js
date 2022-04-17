const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const conexao = require('../database/conexao');
const { errors } = require('../messages/error');

const authorizationToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', "").trim();
    if (!token) {
        return res.status(400).json(errors.accountX);
    }
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);
    
    try {
        const { rowCount } = await conexao.query('select id from usuarios where id = $1', [jwtID]);
        if (rowCount === 0) {
            return res.status(400).json(errors.tokenX);
        }

        next()
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { authorizationToken };