const conexao = require('../database/conexao');

const listingTransactions = async (req, res) => {
    try {
        return res.json("test");
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const getTransactionById = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

const addNewTransaction = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

const updateTransaction = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

const deleteTransaction = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

const bankStatement = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json(error.message);
    }
};

module.exports = {
    listingTransactions,
    getTransactionById,
    addNewTransaction,
    updateTransaction,
    deleteTransaction,
    bankStatement
};