const securePassword = require('secure-password');
const password = securePassword();

const { errors } = require('../messages/error');
const { userPasswordUpdated } = require('../models/usersModel');

const passwordCrypted = async ({ senha }) => {
    const hash = (await password.hash(Buffer.from(senha))).toString("hex");
    return hash;
}

const validatingPassword = async ({ passwordReq, userPasswordDB, email }) => {
    const result = await password.verify(Buffer.from(passwordReq), Buffer.from(userPasswordDB, "hex"));

    switch (result) {
        case securePassword.INVALID_UNRECOGNIZED_HASH:
        case securePassword.INVALID:
            const response = {
                message: errors.loginIncorrect,
                ok: false
            }
            return response;
        case securePassword.VALID:
            break;
        case securePassword.VALID_NEEDS_REHASH:
            try {
                const hash = (await password.hash(Buffer.from(passwordReq))).toString("hex");
                await userPasswordUpdated({ hash, email });
            } catch {
            }
            break;
    }
}

module.exports = {
    passwordCrypted,
    validatingPassword
}