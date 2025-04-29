const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  let userId;

  test('POST /api/auth/signup - Create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe('testuser');
    userId = res.body.user._id;
  });

  test('POST /api/auth/signin - Login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/signin - Login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});