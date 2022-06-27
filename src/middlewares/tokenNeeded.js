const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../../env/jwt_secret');

const conexao = require('../database/connection');
const { fieldToToken } = require('../validations/requiredFields');
const { errors } = require('../messages/error');

const authorizationToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', "").trim();

    const validations = fieldToToken({ token });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    
    try {
        const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);

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