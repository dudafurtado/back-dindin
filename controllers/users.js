const { request } = require('express');
const { Pool } = require('pg');
const conexao = require('../database/conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const pwd = securePassword()

const userFirstAccess = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json("O Campo nome é Obrigatorio.");
    }

    if (!email) {
        return res.status(400).json("O Campo email é Obrigatorio.");
    }

    if (!senha) {
        return res.status(400).json("O Campo senha é Obrigatorio.");
    }

    try {
        const query = 'select * from usuarios whare email = $1';
        const usuario = await conexao.query(query, [email]);

        if (usuario.rowCount > 0) {
            return res.status(400).json("Já existe usuário cadastrado com o e-mail informado.");
        }
    } catch (error) {
        res.status(400).json(error.message);
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = 'insert into usuarios(nome, email, senha) value ($1, $2, $3)';
        const usuario = await conexao.query(query, [nome, email, hash]);

        if (usuario.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o usuário.');
        }
        return res.status(200).json('Usuário cadastrado com sucesso.')
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const userLogIn = async (req, res) => {

    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json("O Campo email é Obrigatorio.");
    }

    if (!senha) {
        return res.status(400).json("O Campo senha é Obrigatorio.");
    }

    try {
        const query = 'select * from usuarios whare email = $1';
        const usuarios = await conexao.query(query, [email]);

        if (usuarios.rowCount == 0) {
            return res.status(400).json("Email ou senha incorretos.");
        }

        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json("Email ou senha incorretos.");
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'update usuarios set senha = $1 where email = $2';
                    await conexao.query(query, [hash, email]);
                } catch (err) {
                }
                break;
        }

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecret);

        return res.send(token);
    } catch (error) {
        res.status(400).json(error.message);
    };
};

const informationToTheUserHimself = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

const userToChangeHimself = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

module.exports = {
    userFirstAccess,
    userLogIn,
    informationToTheUserHimself,
    userToChangeHimself,
};