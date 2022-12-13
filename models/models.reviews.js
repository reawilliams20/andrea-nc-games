const db = require("../db/connection");

exports.selectReviews = () => {
    return db.query(`
    SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows;
    })
}

exports.selectReview = (review_id) => {
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1;`, [review_id])
    .then((result) => {
        if (result.rowCount === 0 ){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return result.rows[0]
    })
}

exports.selectReviewComments = (review_id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at ASC;`, [review_id])
    .then((result) => {
        return result.rows
    })
}

exports.insertComment = (newComment, review_id) => {
    const {body, username} = newComment;
    return db.query(`
    INSERT INTO comments
    (body, author, review_id)
    VALUES
    ($1, $2, $3) 
    RETURNING *;`, [body, username, review_id]).
    then((result) => {return result.rows[0]})
};