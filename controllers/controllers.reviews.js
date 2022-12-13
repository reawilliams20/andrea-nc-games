const {selectReviews, selectReview} = require("../models/models.reviews");

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getReview = (req, res, next) => {
    const review_id = req.params.review_id
    selectReview(review_id)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err);
    })
}