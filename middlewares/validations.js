const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');
const securePassword = require('secure-password');

const password = securePassword()

const passwordCrypted = async (req, res, next) => {
    const { senha } = req.body;

    const hash = (await password.hash(Buffer.from(senha))).toString("hex");

    next();
}

const validatingPassword = async (req, res, next) => {
    const { senha } = req.body;

    const result = await password.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

    switch (result) {
        case securePassword.INVALID_UNRECOGNIZED_HASH:
        case securePassword.INVALID:
            return res.status(400).json("Email ou senha incorretos.");
        case securePassword.VALID:
            break;
        case securePassword.VALID_NEEDS_REHASH:
            try {
                const hash = (await password.hash(Buffer.from(senha))).toString("hex");
                const query = 'update usuarios set senha = $1 where email = $2';
                await conexao.query(query, [hash, email]);
            } catch {
            }
            break;
    }

    next();
}

const creatingToken = (req, res, next) => {
    const { id, nome, email } = req.body;

    const token = jsonwebtoken.sign({
        id: user.id,
        nome: user.nome,
        email: user.email
    }, jwtSecret, {
        expiresIn:'730h'
    });
    
    next();
}

const authorizationToken = (req, res, next) => {
    const { Authorization } = req.headers;

    const token = Authorization.replace('Bearer', "").trim();

    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);
}

const requiredFields = (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    
    if (!descricao) {
        return res.status(400).json("É necessário descrever a transação.");
    }

    if (!valor) {
        return res.status(400).json("É necessário definir o valor da transação.");
    }

    if (!data) {
        return res.status(400).json("É necessário indicar a data transação.");
    }

    if (!categoria_id) {
        return res.status(400).json("É necessário indicar em qual categoria se encaixa a transação.");
    }

    if (!tipo) {
        return res.status(400).json("É necessário informar qual o tipo da transação.");
    }

    next()
}

// import verifyPassword from '../validation/login';
// const middleware = (req: any, res: any, next: any) => {
//    const { password } = req.body;
//    verifyPassword(password);
// }

module.exports = {
    passwordCrypted,
    validatingPassword,
    creatingToken,
    authorizationToken,
    requiredFields
}