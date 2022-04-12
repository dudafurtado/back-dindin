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

module.exports = {
    passwordCrypted,
    validatingPassword
}