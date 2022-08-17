const connection = require('../database/connection');

const userByEmail = async ({ email }) => {
    const getEmail = 'select email from users where email = $1'
    const { rowCount, rows } = await connection(getEmail, [email]);
    return { rowCount, rows };
}

const userAdded = async ({ name, email, hash }) => {
    const addingUser = 'insert into users (name, email, password) values ($1, $2, $3)';
    const { rowCount } = await connection(addingUser, [name, email, hash]);
    return rowCount;
}

const getUser = async ({ email }) => {
    const gettingUser = 'select * from users where email = $1'
    const { rows } = await connection(gettingUser, [ email]);

    return rows[0];
}

const userPasswordUpdated = async ({ hash, email }) => {
    await connection('update users set password = $1 where email = $2', [hash, email]);
} 

const getUserForHimself = async ({ jwtID }) => {
    const { rowCount, rows } = await connection('select * from users where id = $1', [jwtID]);
    return { rowCount, rows };
}

const userUpdated = async ({ name, email, hash, jwtID }) => {
    const updatingUser = 'update users set name = $1, email = $2, password = $3 where id = $4';
    const { rowCount } = await connection(updatingUser, [name, email, hash, jwtID]);
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