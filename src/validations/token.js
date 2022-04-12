const jsonwebtoken = require('jsonwebtoken');

const creatingToken = ({ id, nome, email }) => {
    const token = jsonwebtoken.sign({
        id: user.id,
        nome: user.nome,
        email: user.email
    }, jwtSecret, {
        expiresIn:'730h'
    });
}

const toUseToken = () => {
    const token = Authorization.replace('Bearer', "").trim();
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);
}

module.exports = {
    creatingToken,
    toUseToken,
    jwtID
}