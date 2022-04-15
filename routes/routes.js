const express = require('express');

const { authorizationToken } =  require('../src/middlewares/tokenNeeded')

const users = require('../src/controllers/users');
const category = require('../src/controllers/category')
const transactions = require('../src/controllers/transactions')

const routes = express()

routes.post('/cadastrar', users.userFirstAccess);
routes.post('/login', users.userLogIn);

routes.use(authorizationToken)

routes.get('/usuario', users.informationToTheUserHimself);
routes.put('/usuario', users.userUpdate);

routes.get('/categoria', category.listingAllTheCategories);

routes.get('/transacao/extrato', transactions.bankStatement);
routes.get('/transacao', transactions.listingTransactions); 
routes.get('/transacao/:id', transactions.getTransactionById);
routes.post('/transacao', transactions.addNewTransaction);
routes.put('/transacao/:id', transactions.updateTransaction);
routes.delete('/transacao/:id', transactions.deleteTransaction);

module.exports = routes;