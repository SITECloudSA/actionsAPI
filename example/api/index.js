// this is a typical express app

const express = require("actionsAPI");
const apiApp = express();

const users = require("./user.api");
const products = require("./products.api");

const apiFiles = { users, products };

Object.keys(apiFiles).forEach((k) => apiApp.use(`/${k}`, apiFiles[k]));
/*
The above is equavlent to but in one line:
apiApp.use('/users', users)
apiApp.use('/products', products)
*/

module.exports = { apiFiles, apiApp };
