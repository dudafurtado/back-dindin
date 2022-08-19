const express = require('express');

const { authorizationToken } =  require('../middlewares/tokenNeeded');

const users = require('../controllers/users');
const categories = require('../controllers/categories');
const transactions = require('../controllers/transactions');

const routes = express();

routes.post('/user', users.userFirstAccess);
routes.post('/login', users.userLogIn);

routes.use(authorizationToken);

routes.get('/user', users.informationToTheUserHimself);
routes.put('/user', users.userUpdate);

routes.get('/category', categories.listingAllTheCategories);

routes.get('/bank-statement', transactions.bankStatement);
routes.get('/transaction', transactions.listingTransactions); 
routes.get('/transaction/:id', transactions.getTransactionById);
routes.post('/transaction', transactions.addNewTransaction);
routes.put('/transaction/:id', transactions.updateTransaction);
routes.delete('/transaction/:id', transactions.deleteTransaction);

module.exports = routes;