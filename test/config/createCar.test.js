const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

let accessToken;
describe('Create Cars', () => {
    beforeAll(async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'Jayabaya@binar.co.id',
                password: '123456',
            });
        accessToken = response.body.accessToken;
    });
    afterAll(async () => {
        await Car.destroy({
            where: {
                name: 'Mini Cooper S 2018',
            },
        });
    });
    it('Create car', () => {
        return request(app)
            .post('/v1/cars')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Mini Cooper S 2018',
                price: 200000,
                image: 'https://www.otomaniac.com/wp-content/uploads/2016/02/Harga-Mobil-Mini-Cooper-5-Door.jpg',
                size: 'SMALL',
            })
            .then((res) => {
                expect(res.statusCode).toBe(201);
                expect(res.body).toEqual({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number),
                    size: expect.any(String),
                    image: expect.any(String),
                    isCurrentlyRented: expect.any(Boolean),
                    updatedAt: expect.any(String),
                    createdAt: expect.any(String),
                });
            });
    });
    it('Create car without input', async () => {
        await request(app)
            .post('/v1/cars')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({})
            .then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(422);
                expect(res.body).toEqual({
                    error: {
                        name: expect.any(String),
                        message: expect.any(String),
                    },
                });
            });
    });
});