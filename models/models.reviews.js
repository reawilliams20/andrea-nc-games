const db = require("../db/connection");

exports.selectReviews = () => {
    return db.query(`
    SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews
    FULL OUTER JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows;
    })
}
