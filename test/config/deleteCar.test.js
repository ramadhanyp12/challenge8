const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

var accessToken;

beforeAll(async () => {
    const response = await request(app)
        .post('/v1/auth/login')
        .send({
            email: 'Jayabaya@binar.co.id',
            password: '123456',
        });
    accessToken = response.body.accessToken;
});

describe('DELETE /v1/tasks/:id', () => {
    var car;

    beforeEach(async () => {
        car = await Car.create({
            name: 'Tesla Roadster',
            price: 9800000,
            size: 'SMALL',
            image: 'https://cdn.motor1.com/images/mgl/VA0z9/s3/tesla-roadster.jpg',
            isCurrentlyRented: false,
        });

        return car;
    });

    it('Have response with 200 as status code', async () => request(app)
        .delete(`/v1/cars/${car.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                message: expect.any(String),
            });
        }));
});