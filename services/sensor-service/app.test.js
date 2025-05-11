const request = require('supertest');
const app = require('./app');

describe('Sensor Service', () => {
  it('should return 404 for root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(404);
  });
});
