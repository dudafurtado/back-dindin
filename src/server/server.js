const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

const routes = require('../routes/routes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

module.exports = app;