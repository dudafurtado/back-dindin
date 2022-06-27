const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../../env/jwt_secret');

const creatingToken = ({ user }) => {
    const token = jsonwebtoken.sign({
        id: user.id,
        nome: user.nome,
        email: user.email
    }, jwtSecret, {
        expiresIn:'12h'
    });
    return token;
}

const tokenToGetID = ({ req }) => {
    const token = req.header('Authorization').replace('Bearer', "").trim();
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);
    return jwtID;
}

const tokenToGetEmail = ({ req }) => {
    const token = req.header('Authorization').replace('Bearer', "").trim();
    const { email: jwtEmail } = jsonwebtoken.verify(token, jwtSecret);
    return jwtEmail;
}

module.exports = {
    creatingToken,
    tokenToGetID,
    tokenToGetEmail
}
