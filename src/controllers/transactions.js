const conexao = require('../database/conexao');

const { requiredFields } = require('../validations/requiredFields');
const { validateToken } = require('../validations/token');

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
    const jwtID = validateToken({ req });
    try {
        const transactionExists = await conexao.query('select * from transacoes where usuario_id = $1', [jwtID]);
        return res.status(200).json(transactionExists.rows);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const getTransactionById = async (req, res) => {
    const jwtID = validateToken({ req });

    const { id: paramsID } = req.params;
    try {
        const transactionById = await conexao.query('select * from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);
        if(transactionById.rowCount === 0) {
            return res.status(400).json(errors.transNonexistent);
        }

        return res.status(200).json(transactionById.rows);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const addNewTransaction = async (req, res) => {
    const jwtID = validateToken({ req });

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    requiredFields({ descricao, valor, data, categoria_id, tipo, res });
    try {
        const categoryExists = await conexao.query('select * from categorias where id = $1', [categoria_id]);
        if (categoryExists.rowCount === 0) {
            return res.status(400).json(errors.catNonexistent);
        }

        const query = 'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6)'
        const addTransaction = await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo]);
        if (addTransaction.rowCount === 0) {
            return res.status(400).json(errors.transNotPossible);
        }

        return res.status(200).json(addTransaction.rows[0]);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const updateTransaction = async (req, res) => {
    const jwtID = validateToken({ req });

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    requiredFields({ descricao, valor, data, categoria_id, tipo, res });

    const { id: paramsID } = req.params;
    try {
        const transactionById = await conexao.query('select * from transacoes where id = $1, usuario_id = $2', [paramsID, jwtID]);
        if(transactionById.rowCount === 0) {
            return res.status(400).json(errors.transNonexistent);
        }

        const categoryExists = await conexao.query('select * from categorias where id = $1', [categoria_id]);
        if (categoryExists.rowCount === 0) {
            return res.status(400).json(errors.catNonexistent);
        }

        const query = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, usuario_id = $5, tipo = $6'
        const addTransaction = await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo]);
        if (addTransaction.rowCount === 0) {
            return res.status(400).json(errors.transNotPossible);
        }

        return res.status(200).json(addTransaction.rows[0]);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const deleteTransaction = async (req, res) => {
    const jwtID = validateToken({ req });

    const { id: paramsID } = req.params;
    try {
        const transactionById = await conexao.query('delete from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);
        if(transactionById.rowCount === 0) {
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