const express = require("express");

const {getCategories} = require("./controllers/controllers.categories")

const {getReviews, getReview} = require("./controllers/controllers.reviews");

const {handle404Routes} = require("./controllers/controllers.errors")

const app = express();


app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReview);

app.all('*', handle404Routes);

//handles sql query error
app.use((err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({msg: 'bad request'});
    }
    else{
        next(err);
    }
});

//handles promise reject to send back status and message
app.use((err, req, res, next) => {
    if(err.msg !== undefined){
        res.status(err.status).send({msg: err.msg});
    }
    else{
        next(err);
    }
});

module.exports = app;