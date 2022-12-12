const express = require("express");

const {
getCategories
} = require("./controllers/controllers.categories")
const {handle404Routes} = require("./controllers/controllers.errors")

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.all('*', handle404Routes);

module.exports = app;