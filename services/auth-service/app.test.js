const request = require('supertest');
const app = require('./app');

const User = require('./models/user');
const sequelize = require('./config/database');

describe('Auth Service', () => {
  const testUser = {
    email: 'testuser@email.com',
    password: 'testpass',
    nama: 'Test User',
    nohp: '08123456789',
    alamat: 'Jl. Testing 123'
  };

  beforeAll(async () => {
    // Sync all models to the DB (create tables if not exist)
    await sequelize.sync();
    // Hapus user test jika sudah ada
    await User.destroy({ where: { email: 'testuser@email.com' } });
  });

  it('should register user', async () => {
    const res = await request(app)
      .post('/register')
      .send(testUser);
    expect([200, 201]).toContain(res.statusCode);
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: 'wrongpass' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });
});
