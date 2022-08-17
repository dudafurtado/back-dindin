const { fieldsToTransactions } = require('../validations/requiredFields');
const { tokenToGetID } = require('../validations/token');

const transactionModel = require('../models/transactionsModel');
const categoryModel = require('../models/categoryModel');

const message = require('../messages/messages');

const bankStatement = async (req, res) => {
    try {
        const { sumEntrance, sumExit } = await transactionModel.accountStatement();
        return res.status(200).json({ entrada: sumEntrance, saida: sumExit });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const listingTransactions = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    try {
        const transactions = await transactionModel.transactionsByUserID({ jwtID });
        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getTransactionById = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;
    try {
        const { rowCount, rows } = await transactionModel.transactionByID({ paramsID, jwtID });
        if(rowCount === 0) {
            return res.status(400).json(message.transNonexistent);
        }
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const addNewTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { description, value, date, category_id, type } = req.body;

    const validations = fieldsToTransactions({ 
        description, 
        value, 
        date, 
        category_id, 
        type
    });
    if (!validations.ok) {
        return res.status(400).json(validations.message)
    }

    try {
        const categoryExists = await categoryModel.categoryExists({ category_id });
        if (categoryExists === 0) {
            return res.status(400).json(message.catNonexistent);
        }

        await transactionModel.addTransaction({ 
            description, 
            value, 
            date, 
            category_id, 
            type
        });

        return res.status(200).json(message.transAdded);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updateTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;

    const { description, value, date, category_id, type } = req.body;
    const validations = fieldsToTransactions({ 
        description, 
        value, 
        date, 
        category_id, 
        type
    });
    if (!validations.ok) {
        return res.status(400).json(validations.message)
    }

    try {
        const transactionExists = await transactionModel.transactionByID({ paramsID, jwtID });
        if(transactionExists === 0) {
            return res.status(400).json(message.transNonexistent);
        }

        const categoryExists = await categoryModel.categoryExists({ category_id });
        if (categoryExists === 0) {
            return res.status(400).json(message.catNonexistent);
        }

        await transactionModel.updateTransaction({ 
            description, 
            value, 
            date, 
            category_id, 
            type,
            paramsID 
        });

        return res.status(200).json(message.transUpdated);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deleteTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;

    try {
        await transactionModel.deleteTransaction({ paramsID, jwtID });

        return res.status(200).json(message.transDeleted);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

module.exports = {
    bankStatement,
    listingTransactions,
    getTransactionById,
    addNewTransaction,
    updateTransaction,
    deleteTransaction
};