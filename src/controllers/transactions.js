const { fieldsToTransactions } = require('../validations/requiredFields');
const { tokenToGetID } = require('../validations/token');

const transactionModel = require('../models/transactionsModel');
const categoryModel = require('../models/categoryModel');

const { errors } = require('../messages/error');

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
        const transactions = await transactionModel.listTransactionsByUserID({ jwtID });
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
            return res.status(400).json(errors.transNonexistent);
        }
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const addNewTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const validations = fieldsToTransactions({ 
        descricao, 
        valor, 
        data, 
        categoria_id, 
        tipo
    });
    if (!validations.ok) {
        return res.status(400).json(validations.message)
    }

    try {
        const categoryExists = await categoryModel.categoryExists({ categoria_id });
        if (categoryExists === 0) {
            return res.status(400).json(errors.catNonexistent);
        }

        const { rowCount, rows } = await transactionModel.addTransaction({ 
            descricao, 
            valor, 
            data, 
            categoria_id, 
            jwtID, 
            tipo 
        });
        if (rowCount === 0) {
            return res.status(500).json(errors.transNotPossible);
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const validations = fieldsToTransactions({ 
        descricao, 
        valor, 
        data, 
        categoria_id, 
        tipo 
    });
    if (!validations.ok) {
        return res.status(400).json(validations.message)
    }

    try {
        const transactionExists = await transactionModel.transactionByID({ paramsID, jwtID });
        if(transactionExists === 0) {
            return res.status(400).json(errors.transNonexistent);
        }

        const categoryExists = await categoryModel.categoryExists({ categoria_id });
        if (categoryExists === 0) {
            return res.status(400).json(errors.catNonexistent);
        }

        const { rowCount, rows } = await transactionModel.updateTransaction({ 
            descricao, 
            valor, 
            data, 
            categoria_id, 
            jwtID, 
            tipo, 
            paramsID 
        });
        if (rowCount === 0) {
            return res.status(500).json(errors.transNotPossible);
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deleteTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;

    try {
        const deletedTransaction = await transactionModel.deleteTransaction({ paramsID, jwtID });
        if(deletedTransaction === 0) {
            return res.status(500).json(errors.transNonexistent);
        }

        return res.status(200).json(errors.transSuccess);
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