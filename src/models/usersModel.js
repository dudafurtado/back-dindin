const conexao = require('../database/connection');

const userByEmail = async ({ email }) => {
    const getEmail = 'select email from usuarios where email = $1'
    const { rowCount, rows } = await conexao.query(getEmail, [email]);
    return { rowCount, rows };
}

const userAdded = async ({ nome, email, hash }) => {
    const addingUser = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
    const { rowCount } = await conexao.query(addingUser, [nome, email, hash]);
    return rowCount;
}

const getUser = async ({ email }) => {
    const gettingUser = 'select id, nome, email from usuarios where email = $1'
    const { rows } = await conexao.query(gettingUser, [ email]);

    return rows[0];
}

const userPasswordUpdated = async ({ hash, email }) => {
    await conexao.query('update usuarios set senha = $1 where email = $2', [hash, email]);
} 

const getUserForHimself = async ({ jwtID }) => {
    const { rowCount, rows } = await conexao.query('select * from usuarios where id = $1', [jwtID]);
    return { rowCount, rows };
}

const userUpdated = async ({ nome, email, hash, jwtID }) => {
    const updatingUser = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4';
    const { rowCount } = await conexao.query(updatingUser, [nome, email, hash, jwtID]);
    return rowCount;
}

module.exports = {
    userByEmail,
    userAdded,
    getUser,
    userPasswordUpdated,
    getUserForHimself,
    userUpdated
}