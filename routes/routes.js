const express = require('express');
const users = require('../controllers/users');
const category = require('../controllers/category')
const transactions = require('../controllers/transactions')

const routes = express()

// controllers users
routes.post('/cadastrar', users.userFirstAccess);
routes.post('/login', users.userLogIn);
// needs a token to getting in
routes.get('/usuario', users.informationToTheUserHimself);
routes.put('/usuario', users.userToChangeHimself);

// controllers category
routes.get('categoria', category.listingAllTheCategories);

// controllers transactions
routes.get('/transacao/extrato', transactions.bankStatement);
routes.get('/transacao', transactions.listingTransactions); //parametro tipo query filtro
routes.get('/transacao/:id', transactions.getTransactionById);
routes.post('/transacao', transactions.addNewTransaction);
routes.put('/transacao/:id', transactions.updateTransaction);
routes.delete('/transacao/:id', transactions.deleteTransaction);

module.exports = routes;