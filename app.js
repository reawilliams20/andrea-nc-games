const express = require("express");

const {getCategories} = require("./controllers/controllers.categories")
const { getReviews } = require("./controllers/controllers.reviews");
const {handle404Routes} = require("./controllers/controllers.errors");

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.all('*', handle404Routes);

module.exports = app;