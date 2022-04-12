const express = require('express');
const users = require('../controllers/users');
const category = require('../controllers/category')
const transactions = require('../controllers/transactions');
const { validaToken } = require('../middlewares/token');

const routes = express()

// controllers users
routes.post('/cadastrar', users.userFirstAccess);
routes.post('/login', users.userLogIn);

routes.use(validaToken);
// needs a token to getting in
routes.put('/usuario/atualizar', users.userUpdate);
routes.get('/usuario/:id', users.informationToTheUserHimself);


// controllers category
routes.get('/categoria', category.listingAllTheCategories);
routes.get('/categoria.usuario', category.userCategory);

// controllers transactions
routes.get('/transacao', transactions.listingTransactions); //parametro tipo query filtro
routes.get('/transacao/:id', transactions.getTransactionById);
routes.post('/transacao', transactions.addNewTransaction);
routes.put('/transacao/:id', transactions.updateTransaction);
routes.delete('/transacao/:id', transactions.deleteTransaction);
routes.get('/transacao/extrato', transactions.bankStatement);

module.exports = routes;