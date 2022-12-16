const express = require("express");
const {getCategories} = require("./controllers/controllers.categories");
const {getReviews, getReview, getReviewComments,postComment, updateReview} = require("./controllers/controllers.reviews");
const {deleteComment} = require("./controllers/controllers.comments");
const {getUsers} = require("./controllers/controllers.users");
const {handle404Routes, handle400Error, handle500Error, handle404Error} = require("./error-handling");

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/users', getUsers);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReview);
app.patch('/api/reviews/:review_id', updateReview);

app.get('/api/reviews/:review_id/comments', getReviewComments);
app.post('/api/reviews/:review_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment);

app.use(handle400Error);
app.use(handle500Error);
app.use(handle404Error);
app.all('*', handle404Routes);


module.exports = app;