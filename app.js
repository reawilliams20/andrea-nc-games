const express = require("express");
const {getCategories} = require("./controllers/controllers.categories")
const {getReviews, getReview, getReviewComments,postComment} = require("./controllers/controllers.reviews");
const {handle404Routes, handle400Error, handle500Error} = require("./error-handling")

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReview);

app.get('/api/reviews/:review_id/comments', getReviewComments);
app.post('/api/reviews/:review_id/comments', postComment);

app.use(handle400Error);
app.use(handle500Error);
app.all('*', handle404Routes);


module.exports = app;