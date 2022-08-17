const securePassword = require('secure-password');
const pwd = securePassword();

const passwordCrypted = async ({ password }) => {
    const hash = (await pwd.hash(Buffer.from(password))).toString("hex");
    return hash;
}

module.exports = {
    passwordCrypted
}