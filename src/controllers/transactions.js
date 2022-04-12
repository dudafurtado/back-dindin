const conexao = require('../database/conexao');
const securePassword = require('secure-password');
const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const { requiredFields } = require('../validations/requiredFields')

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
    const Authorization = req.header('Authorization');
    const token = Authorization.replace('Bearer', "").trim();
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);

    try {
        const transactionExists = await conexao.query('select * from transacoes where usuario_id = $1', [jwtID]);
        return res.status(200).json(transactionExists.rows);
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const getTransactionById = async (req, res) => {
    const { id: paramsID } = req.params;
    const Authorization = req.header('Authorization');

    const token = Authorization.replace('Bearer', "").trim();

    if (!token) {
        return res.status(400).json("É preciso ter uma conta para ver as transação");
    }

    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret);

    try {
        const transactionById = await conexao.query('select * from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID]);

        if(transactionById.rowCount === 0) {
            return res.status(400).json('Não foi possível encontrar transação')
        }

        return res.status(200).json(transactionById.rows);

    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const addNewTransaction = async (req, res) => {
    const Authorization = req.header('Authorization');
    const token = Authorization.replace('Bearer', "").trim()
    if (!token) {
        return res.status(400).json("É preciso ter uma conta para adicionar as transações");
    }
    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret)

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    requiredFields({ descricao, valor, data, categoria_id, tipo })

    try {
        const categoryExists = await conexao.query('select * from categorias where id = $1', [categoria_id])
        if (categoryExists.rowCount === 0) {
            return res.status(400).json('A categoria indicada não existe')
        }

        const query = 'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6)'
        const addTransaction = await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo])
        if (addTransaction.rowCount === 0) {
            return res.status(400).json('Não foi possível adicionar essa transação')
        }

        return res.status(200).json(addTransaction.rows[0])
    } catch(error) {
        return res.status(400).json(error.message);
    }
};

const updateTransaction = async (req, res) => {
    const { id: paramsID } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const Authorization = req.header('Authorization');

    const token = Authorization.replace('Bearer', "").trim()

    if (!token) {
        return res.status(400).json("É preciso ter uma conta para adicionar as transações");
    }

    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret)

    if (!descricao) {
        return res.status(400).json("É necessário descrever a transação.");
    }

    if (!valor) {
        return res.status(400).json("É necessário definir o valor da transação.");
    }

    if (!data) {
        return res.status(400).json("É necessário indicar a data transação.");
    }

    if (!categoria_id) {
        return res.status(400).json("É necessário indicar em qual categoria se encaixa a transação.");
    }

    if (!tipo) {
        return res.status(400).json("É necessário informar qual o tipo da transação.");
    }
    
    try {
        const transactionById = await conexao.query('select * from transacoes where id = $1, usuario_id = $2', [paramsID, jwtID]);

        if(transactionById.rowCount === 0) {
            return res.status(400).json('Não foi possível encontrar essa transação')
        }

        const categoryExists = await conexao.query('select * from categorias where id = $1', [categoria_id])

        if (categoryExists.rowCount === 0) {
            res.status(400).json('A categoria indicada não existe');
        }

        if (tipo !== 'entrada' || tipo !== 'saída') {
            res.status(400).json('O tipo indicado não existe');
        }

        const query = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, usuario_id = $5, tipo = $6'
        const addTransaction = await conexao.query(query, [descricao, valor, data, categoria_id, jwtID, tipo])

        if (addTransaction.rowCount === 0) {
            res.status(400).json('Não foi possível adicionar essa transação')
        }

        res.status(200).json(addTransaction.rows[0])

    } catch(error) {
        res.status(400).json(error.message);
    }
};

const deleteTransaction = async (req, res) => {
    const { id: paramsID } = req.params
    const Authorization = req.header('Authorization');

    const token = Authorization.replace('Bearer', "").trim()

    if (!token) {
        return res.status(400).json("É preciso ter uma conta para ver as transações");
    }

    const { id: jwtID } = jsonwebtoken.verify(token, jwtSecret)

    try {
        const transactionById = await conexao.query('delete from transacoes where id = $1 and usuario_id = $2', [paramsID, jwtID])

        if(transactionById.rowCount === 0) {
            return res.status(400).json('Não foi possível encontrar essa transação')
        }

        return res.status(200).json("Transação deletada com sucesso")

    } catch(error) {
        res.status(400).json(error.message);
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