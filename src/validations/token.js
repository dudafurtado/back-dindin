const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const creatingToken = ({ id, nome, email }) => {
    const token = jsonwebtoken.sign({
        id: user.id,
        nome: user.nome,
        email: user.email
    }, jwtSecret, {
        expiresIn:'730h'
    });
    return token;
}

const validateToken = ({ req }) => {
    const token = req.header('Authorization').replace('Bearer', "").trim();
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);
    return jwtID;
}

module.exports = {
    creatingToken,
    validateToken
}
