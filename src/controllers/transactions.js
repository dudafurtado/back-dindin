const conexao = require('../database/conexao');

const { fieldsToTransactions } = require('../validations/requiredFields');
const { tokenToGetID } = require('../validations/token');

const { errors } = require('../messages/error');

const bankStatement = async (req, res) => {
    try {
        const typeEntrance = await conexao.query('select sum(valor) from transacoes where tipo = $1', ['entrada']);
        const typeExit = await conexao.query('select sum(valor) from transacoes where tipo = $1', ['saida']);
        return res.status(200).json({ entrada: typeEntrance.rows[0].sum, saida: typeExit.rows[0].sum });
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const listingTransactions = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    try {
        const { rows } = await conexao.query('select * from transacoes where usuario_id = $1', [jwtID]);
        return res.status(200).json(rows);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const getTransactionById = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;
    try {
        const { rowCount, rows } = await conexao.query('select * from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);
        if(rowCount === 0) {
            return res.status(400).json(errors.transNonexistent);
        }
        return res.status(200).json(rows);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const addNewTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const validations = fieldsToTransactions({ descricao, valor, data, categoria_id, tipo});
    if (!validations.ok) {
        return res.status(400).json(validations.message)
    }
    try {
        const { rowCount: categoryExists } = await conexao.query('select * from categorias where id = $1', [categoria_id]);
        if (categoryExists === 0) {
            return res.status(400).json(errors.catNonexistent);
        }

        const query = 'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6)'
        const { rowCount: addTransaction, rows } = await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo]);
        if (addTransaction === 0) {
            return res.status(400).json(errors.transNotPossible);
        }

        return res.status(200).json(rows[0]);
    } catch(error) {
        return res.status(400).json(error);
    }
};

const updateTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });
    const { id: paramsID } = req.params;

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const validations = fieldsToTransactions({ descricao, valor, data, categoria_id, tipo});
    if (!validations.ok) {
        return res.status(400).json(validations.message)
    }
    try {
        const { rowCount: transactionById } = await conexao.query('select * from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);
        if(transactionById === 0) {
            return res.status(400).json(errors.transNonexistent);
        }

        const { rowCount: categoryExists } = await conexao.query('select * from categorias where id = $1', [categoria_id]);
        if (categoryExists === 0) {
            return res.status(400).json(errors.catNonexistent);
        }

        const query = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, usuario_id = $5, tipo = $6 where id = $7'
        const { rowCount: addTransaction, rows } = await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo, paramsID]);
        if (addTransaction === 0) {
            return res.status(400).json(errors.transNotPossible);
        }

        return res.status(200).json(rows[0]);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const deleteTransaction = async (req, res) => {
    const jwtID = tokenToGetID({ req });

    const { id: paramsID } = req.params;
    try {
        const { rowCount: transactionById } = await conexao.query('delete from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);
        if(transactionById === 0) {
            return res.status(400).json(errors.transNonexistent);
        }

        return res.status(200).json(errors.transSuccess);
    } catch(error) {
        return res.status(400).json(error.message);
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