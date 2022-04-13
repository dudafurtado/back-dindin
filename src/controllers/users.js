const conexao = require('../database/conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const pwd = securePassword()

const userFirstAccess = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json("O Campo nome é obrigatorio.");
    }

    if (!email) {
        return res.status(400).json("O Campo email é obrigatorio.");
    }

    if (!senha) {
        return res.status(400).json("O Campo senha é obrigatorio.");
    }

    try {
        const query = 'select * from usuarios where email = $1';
        const userByEmail = await conexao.query(query, [email]);

        if (userByEmail.rowCount > 0) {
            return res.status(400).json("Já existe um usuário cadastrado com o e-mail informado.");
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        const queryOne = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
        const userRegistered = await conexao.query(queryOne, [nome, email, hash]);

        if (userRegistered.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o usuário.');
        }

        const queryTwo = 'select * from usuarios where email = $1';
        const userByEmail2 = await conexao.query(queryTwo, [email]);
        const {id: idSignIn, nome: nomeSignIn, email: emailSignIn } = userByEmail2.rows[0]

        return res.status(200).json({ id: idSignIn, nome: nomeSignIn, email: emailSignIn })
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userLogIn = async (req, res) => {

    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json("O campo email é obrigatorio.");
    }

    if (!senha) {
        return res.status(400).json("O campo senha é obrigatorio.");
    }

    try {
        const query = 'select * from usuarios where email = $1';
        const userByEmail = await conexao.query(query, [email]);

        if (userByEmail.rowCount === 0) {
            return res.status(400).json("Email ou senha incorretos.");
        }

        const user = userByEmail.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(user.senha, "hex"));

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
                } catch (error) {
                }
                break;
        }

        const token = jwt.sign({
            id: user.id,
            nome: user.nome,
            email: user.email
        }, jwtSecret, {
            expiresIn: "730h"
        });

        return res.send(token);
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const informationToTheUserHimself = async (req, res) => {
    try {

    } catch (error) {
        return res.status(400).json(error.message);
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