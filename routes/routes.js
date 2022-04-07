const express = require('express');
const users = require('../controllers/users');
const category = require('../controllers/category')
const transactions = require('../controllers/transactions')

const rotas = express()

// controllers users
rotas.post('/usuario', users.userFirstAccess);
rotas.post('/login', users.userLogIn);
// needs a token to getting in
rotas.get('/usuario', users.informationToTheUserHimself);
rotas.put('/usuario', users.userToChangeHimself);

// controllers category
rotas.get('categoria', category.listingAllTheCategories);

// controllers transactions
rotas.get('/transacao', transactions.listingTransactions); //parametro tipo query filtro
rotas.get('/transacao/:id', transactions.getTransactionById);
rotas.post('/transacao', transactions.addNewTransaction);
rotas.put('/transacao/:id', transactions.updateTransaction);
rotas.delete('/transacao/:id', transactions.deleteTransaction);
rotas.get('/transacao/extrato', transactions.bankStatement);
