const app = require("../app");
const request = require('supertest');

const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('/api for all non-existent routes in app', () => {
    test('404: non existent path', () => {
        return request(app)
        .get('/not-a-route')
        .expect(404)
        .then(({body : {msg}}) => {
            expect(msg).toBe("path not found");
        })
    })
});

describe('/api/categories', () => {
    test('200: OK, returns with categories', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({body : {categories}}) => {
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })
    });
});

describe('/api/reviews', () => {
    test('200: OK, returns with reviews', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body : {reviews}}) => {
            expect(reviews).toHaveLength(13);
            expect(reviews).toBeSortedBy('created_at', { descending: true });
            reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    });
});

describe('/api/reviews/:review_id', () => {
    test('200, responds relevant review', () => {
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({body: {review}}) => {
            expect(review).toMatchObject({
                    review_id: review_id,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 5
                })
        });
    });
    test('404: valid id but does not exist, responds with 404 error message', () => {
        return request(app)
        .get('/api/reviews/40')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Not found')
        })
    });
    test('400: invalid id, responds with 400 error message', () => {
        return request(app)
        .get('/api/reviews/game1')
        .expect(400)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    })
});


  describe("GET /api/reviews/:review_id/comments", () => {
    test('200: responds with corresponding comments of given review_id', () => {
        const review_id = 3;
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(3);
            expect(comments).toBeSortedBy('created_at', { descending: true });
            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: review_id
                })
                )
            })
        })
    });
    test('200: valid id but no comments for it, responds with empty array', () => {
        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(0);
            expect(comments).toEqual([]);
            })
        });
    test('404: valid id but not found, responds with 404 error message', () => {
        return request(app)
        .get('/api/reviews/999/comments')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Not found')
        })
    });
    test('400: invalid id, responds with 400 error message', () => {
        return request(app)
        .get(`/api/reviews/review3/comments`)
        .expect(400)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    });
})

describe("POST /api/reviews/:review_id/comments", () => {
    test("201: created, responds with newly created comment for specified review_id", () => {
        const review_id = 1;
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .expect(201)
        .send({
            "body": "some text...",
            "username": "mallionaire"
        })
        .then(({body: {comment}}) => {
            const newComment = comment
            expect(newComment).toEqual(
                expect.objectContaining({
                  comment_id: 7,
                  body: "some text...",
                  review_id: review_id,
                  "author": "mallionaire",
                  "votes": 0,
                  created_at: expect.any(String)
                
              })
            )
        })
    });
    test("201: created, ignoring extra properties", () => {
        const review_id = 1;
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .expect(201)
        .send({
            "body": "some text...",
            "username": "mallionaire",
            "review_id": 2,
            "votes": 3
        })
        .then(({body: {comment}}) => {
            const newComment = comment
            expect(newComment).toEqual(
                expect.objectContaining({
                  comment_id: 7,
                  body: "some text...",
                  review_id: review_id,
                  "author": "mallionaire",
                  "votes": 0,
                  created_at: expect.any(String)
                
              })
            )
        })
    });
    test('400: missing keys', () => {
        const review_id = 1;
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send({})
        .expect(400)
        .send((response) => {
            const msg = response.body.msg
            expect(msg).toBe('invalid/missing key in request')
        })
    });
    test('400: invalid key', () => {
        const review_id = 1;
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send({"body": 555,
        "username": "mallionaire"})
        .expect(400)
        .send((response) => {
            const msg = response.body.msg
            expect(msg).toBe('invalid/missing key in request')
        })
    });
    test('400: other property on request body', () => {
        const review_id = 1;
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send({"body": "test body",
        "other-property": "mallionaire"})
        .expect(400)
        .send((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    });
    test('404: valid id but does not exist, responds with 404 error message', () => {
        return request(app)
        .post('/api/reviews/333/comments')
        .send({"body": "here is a comment",
        "username": "mallionaire"})
        .expect(404)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Not found')
        })
    });
    test('400: invalid id, responds with 400 error message', () => {
        return request(app)
        .post('/api/reviews/game52/comments')
        .send({"body": "here is a comment",
        "username": "mallionaire"})
        .expect(400)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    })
})


describe("PATCH /api/reviews/:review_id", () => {
    test('200: responds with newly updated review', () => {
        const review_id = 1
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({inc_votes : 1})
        .expect(200)
        .then(({body: {review}}) => {
            const updatedReview = review
            expect(updatedReview).toEqual(
                expect.objectContaining({
                    review_id: review_id,
                    title: "Agricola",
                    designer: "Uwe Rosenberg",
                    owner: "mallionaire",
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: "Farmyard fun!",
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 2
                })
            )
        });
    });
    test('200: responds with newly updated review, ignoring extra properties', () => {
        const review_id = 1
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({
            inc_votes: 1,
            owner: "new owner"
        })
        .expect(200)
        .then(({body: {review}}) => {
            const updatedReview = review
            expect(updatedReview).toEqual(
                expect.objectContaining({
                    review_id: review_id,
                    title: "Agricola",
                    designer: "Uwe Rosenberg",
                    owner: "mallionaire",
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: "Farmyard fun!",
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 2
                })
            )
        });
    });
    test('200: responds with newly updated review, negative inc_votes value', () => {
        const review_id = 2
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({inc_votes: -1})
        .expect(200)
        .then(({body: {review}}) => {
            const updatedReview = review
            expect(updatedReview).toEqual(
                expect.objectContaining({
                    review_id: review_id,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: "2021-01-18T10:01:41.251Z",
                    votes: 4
                })
            )
        });
    });
    test('404: valid id but does not exist, respond appropriately', () => {
        return request(app)
        .patch('/api/reviews/77')
        .send({inc_votes: 1})
        .expect(404)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Not found')
        })
    });
    test('400: invalid id, respond appropriately', () => {
        return request(app)
        .patch('/api/reviews/game400')
        .send({inc_votes: 50})
        .expect(400)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    });
    test('400: missing keys', () => {
        return request(app)
        .patch('/api/reviews/3')
        .send({})
        .expect(400)
        .send((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    });
    test('400: invalid key', () => {
        return request(app)
        .patch('/api/reviews/3')
        .send({"inc_votes": "cat"})
        .expect(400)
        .send((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    });
    test('400: non existing property on request body', () => {
        return request(app)
        .patch('/api/reviews/1')
        .send({
            inc_votes: 2,
            other_property: "some category text"
        })
        .expect(400)
        .send((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    });
})

describe('/api/users', () => {
    test('200: OK, returns with users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body : {users}}) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    });
});


describe('GET /api/reviews QUERIES', () => {
    test('200: accepts sort_by query; should return title desc', () => {
        return request(app)
        .get('/api/reviews?sort_by=title')
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toBeSortedBy('title', {descending: true})
        })
    })
    test('400: invalid sort_by query', () => {
        return request(app)
        .get('/api/reviews?sort_by=hello')
        .expect(400)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    })
    test('200: accepts category query; should return category desc', () => {
        return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toBeSortedBy('created_at', {descending: true})
            expect(reviews).toHaveLength(1);
            reviews.forEach((review) => {
                expect(review.category).toBe("dexterity")
            })
        })
    })
    test('404: invalid category query', () => {
        return request(app)
        .get('/api/reviews?category=scary')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Not found')
        })
    })
    test('200: category valid but no results', () => {
        return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toEqual([])
        })
    })
    test('200: accepts order query; should return reviews in specified order', () => {
        return request(app)
        .get('/api/reviews?order=asc')
        .expect(200)
        .then(({body: {reviews}}) => {
            expect(reviews).toBeSortedBy('created_at')
        })
    })
    test('400: invalid order query', () => {
        return request(app)
        .get('/api/reviews?order=hello')
        .expect(400)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('bad request')
        })
    })
    
})