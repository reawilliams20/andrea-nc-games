const express = require("express");

const {getCategories} = require("./controllers/controllers.categories")

const {getReviews, getReview, getReviewComments} = require("./controllers/controllers.reviews");

const {handle404Routes, handle400Error, handle500Error} = require("./error-handling")

const app = express();


app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReview);

app.get('/api/reviews/:review_id/comments', getReviewComments);

app.use(handle400Error);
app.use(handle500Error);
app.all('*', handle404Routes);


module.exports = app;