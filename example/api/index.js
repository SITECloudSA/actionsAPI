// this is a typical express app

const express = require("../../index");
const app = express();

const users = require("./user.api");
const products = require("./products.api");

const allFiles = { users, products };

Object.keys(allFiles).forEach((k) => app.use(`/${k}`, allFiles[k]));
/*
The above is equavlent to but in one line:
app.use('/users', users)
app.use('/products', products)
*/

module.exports = app;
