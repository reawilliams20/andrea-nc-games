const {selectReviews, selectReview, selectReviewComments} = require("../models/models.reviews");

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

exports.getReviewComments = (req, res, next) => {
    const review_id = req.params.review_id
    const promises = [selectReviewComments(review_id), selectReview(review_id)]
    Promise.all(promises)
    .then(([comments]) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err);
    })
}