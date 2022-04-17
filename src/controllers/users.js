const conexao = require('../database/conexao');
const { errors } = require('../messages/error');
const { fieldsToUser, fieldsToLogin } = require('../validations/requiredFields');
const { tokenToGetID, tokenToGetEmail } = require('../validations/token');
const jwtSecret = require('../jwt_secret');

const jwt = require('jsonwebtoken');
const securePassword = require('secure-password');
const pwd = securePassword()

const userFirstAccess = async (req, res) => {
    const { nome, email, senha } = req.body;
    const validations = fieldsToUser({ nome, email, senha });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    try {
        const getEmail = 'select email from usuarios where email = $1'
        const { rowCount: emailExists } = await conexao.query(getEmail, [email]);
        if (emailExists > 0) {
            return res.status(400).json(errors.userExists);
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        const addUser = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
        const { rowCount: userCreated } = await conexao.query(addUser, [nome, email, hash]);
        if (userCreated === 0) {
            return res.status(400).json(errors.couldNotSignin);
        }

        const getUser = 'select * from usuarios where email = $1'
        const { rows } = await conexao.query(getUser, [email]);
        const { 
            id: idSignIn,
            nome: nomeSignIn,
            email: emailSignIn
        } = rows[0];

        return res.status(200).json({ id: idSignIn,
            nome: nomeSignIn,
            email: emailSignIn
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userLogIn = async (req, res) => {
    const { email, senha } = req.body;
    const validations = fieldsToLogin({ email, senha });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    try {
        const { rowCount, rows } = await conexao.query('select * from usuarios where email = $1', [email]);
        if (rowCount === 0) {
            return res.status(400).json(errors.loginIncorrect);
        }
        const user = rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(user.senha, "hex"));
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json(errors.loginIncorrect);
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    await conexao.query('update usuarios set senha = $1 where email = $2', [hash, email]);
                } catch (error) {
                }
                break;
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, jwtSecret, {
            expiresIn: "730h"
        });

        return res.send({
            usuarios: {
                id: user.id,
                nome: user.nome,
                email: user.email
            },
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    };

};

const informationToTheUserHimself = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    try {
        const { rowCount, rows } = await conexao.query('select * from usuarios where id = $1', [jwtID]);
        if (rowCount === 0) {
            return res.status(404).json(errors.userNotFound);
        }

        const { senha: _, ...outrosDados } = rows[0];
        return res.status(201).json({
            ...outrosDados,
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userUpdate = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const jwtEmail = tokenToGetEmail({ req })
    
    const { nome, email, senha } = req.body;
    const validations = fieldsToUser({ nome, email, senha });
    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }
    try {
        const { rowCount: ifEmailExists } = await conexao.query('select * from usuarios where email = $1', [email]);

        if (ifEmailExists !== jwtEmail) {
            return res.status(404).json("O e-mail informado já está sendo utilizado por outro usuário.");
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        const queryOne = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4';
        const { rowCount: userUpdated } = await conexao.query(queryOne, [nome, email, hash, jwtID]);
        if (userUpdated === 0) {
            return res.status(400).json('Não foi possivel atualizar o usuário.');
        }

        const { rows } = await conexao.query('select * from usuarios where email = $1', [email]);
        const { id: _, ...dados } = rows[0];

        return res.status(200).json({ ...dados, senha })
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


module.exports = {
    userFirstAccess,
    userLogIn,
    userUpdate,
    informationToTheUserHimself
};