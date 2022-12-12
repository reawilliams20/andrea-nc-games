const db = require("../db/connection");

exports.selectReviews = () => {
    return db.query(`
    SELECT review_id, title, designer, owner, review_img_url, review_body, category, created_at, votes, COUNT(review_id) AS comment_count FROM reviews
    GROUP BY review_id
    ORDER BY created_at DESC;`)
    .then((result) => {
        return result.rows;
    })
}