const securePassword = require('secure-password');
const password = securePassword();

const passwordCrypted = async ({ senha }) => {
    const hash = (await password.hash(Buffer.from(senha))).toString("hex");
    return hash;
}

module.exports = {
    passwordCrypted
}