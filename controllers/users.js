const conexao = require('../database/conexao');

const userFirstAccess = async (req, res) => {
    try {

    } catch(error) {
        res.status(400).json(error.message);
    }
};

const userLogIn = async (req, res) => {
    try {

    } catch(error) {
        res.status(400).json(error.message);
    }
};

const informationToTheUserHimself = async (req, res) => {
    try {

    } catch(error) {
        res.status(400).json(error.message);
    }
};

const userToChangeHimself = async (req, res) => {
    try {

    } catch(error) {
        res.status(400).json(error.message);
    }
};

module.exports = {
    userFirstAccess,
    userLogIn,
    informationToTheUserHimself,
    userToChangeHimself,
};