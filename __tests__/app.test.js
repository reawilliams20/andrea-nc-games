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
            expect(categories).toBeInstanceOf(Array);
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
            expect(reviews).toBeInstanceOf(Array);
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
    });
  });


  describe("GET /api/reviews/:review_id/comments", () => {
    test('200: responds with corresponding comments of given review_id', () => {
        const review_id = 3;
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then(({body: {comments}}) => {
            console.log(comments)
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(3);
            expect(comments).toBeSortedBy('created_at', { ascending: true });
            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                })
                )
            })
        })
    })
    test('404: valid id but no comments for it, responds with 404 error message', () => {
        return request(app)
        .get('/api/reviews/1/comments')
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