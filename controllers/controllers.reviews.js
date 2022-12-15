const {selectReviews, selectReview, selectReviewComments, insertComment, patchReview, selectUsers} = require("../models/models.reviews");

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
exports.postComment = (req, res, next) => {
    const review_id = req.params.review_id
    const newComment = req.body
    insertComment(newComment, review_id)
    .then((comment) => {
        res.status(201).send({comment})
      })
    .catch((err) => {
        next(err);
    })
};

exports.updateReview = (req, res, next) => {
    const review_id = req.params.review_id
    const updateReview = req.body
    patchReview(updateReview, review_id)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })
}
