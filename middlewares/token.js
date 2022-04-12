const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');
const conexao = require('../database/conexao');



const validaToken = async (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar esse recurso o token de autenticação válido deve ser enviado' });
    }

    try {
        const token = authorization.replace("Bearer", "").trim();

        const { id } = await jwt.verify(token, jwtSecret);

        const query = "SELECT * FROM usuarios where id = $1"
        const { rowCount, rows } = await conexao.query(query, [id]);
        if (rowCount === 0) {
            return res.status(401).json({ mensagem: 'Para acessar esse recurso o token de autenticação válido deve ser enviado' });
        }
        req.usuario = rows[0]

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Para acessar esse recurso o token de autenticação válido deve ser enviado' });

    }
};

module.exports = {
    validaToken
};