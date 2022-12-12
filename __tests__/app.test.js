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
    test('404: route not found', () => {
        return request(app)
        .get('/api/categorie/')
        .expect(404)
        .then(({body : {msg}}) => {
            expect(msg).toBe("path not found");
        })
    })
});