const db = require("../db/connection");

exports.selectReviews = (category, sort_by="created_at", order="desc") => {
    const validOrderQueries = ['asc', 'desc']
    const validSortByQueries = ['title', 'designer', 'owner', 'review_img_url', 'category', 'created_at', 'votes', 'review_id']
    const validCategoryQueries = ['euro game', 'social deduction', 'dexterity', "children's games"]

    if(!validSortByQueries.includes(sort_by) || !validOrderQueries.includes(order)) {
        return Promise.reject({status: 400, msg: 'bad request'});
    }

    let queryString = `
    SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id `

    const queryArr = []
    if (category !== undefined) {
        if (!validCategoryQueries.includes(category)) {
            return Promise.reject({status: 404, msg: 'Not found'})
        } else {
            queryString += ` WHERE category = $1 `
            queryArr.push(category)
        }
    }
    
    queryString += `GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order};`

    return db.query(queryString, queryArr)
    .then((result) => {
        return result.rows;
    })
}

exports.selectReview = (review_id) => {
    return db.query(`
    SELECT reviews.review_id, title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, 
    COUNT(comments.review_id) AS comment_count 
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`, [review_id])
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
    ORDER BY created_at DESC;`, [review_id])
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
    RETURNING *;`, [body, username, review_id])
    .then((result) => {return result.rows[0]})
};

exports.patchReview = (updateReview, review_id) => {
    const {inc_votes} = updateReview;
    return db.query(`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;`, [inc_votes, review_id])
    .then((result) => { 
        if (result.rowCount === 0 ){
        return Promise.reject({status: 404, msg: 'Not found'})
    }
    return result.rows[0]})
}