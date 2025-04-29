const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Item = require('../models/item');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Create a test user
  const testUser = new User({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  await testUser.save();

  // Generate a token for authentication
  const token = jwt.sign({ userId: testUser._id }, '3d5b9a1c4e7f2a8c6d9e0b4a3f7c8d6e9f1a2b3c4d5e6f7a8b9c0d1e2f3be');
  global.testToken = token;
  global.testUserId = testUser._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Item Routes', () => {
  let itemId;

  test('POST /api/items - Create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${global.testToken}`)
      .send({
        name: 'Test Item',
        description: 'This is a test item',
        category: 'Electronics',
        found: false
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Item');
    itemId = res.body._id;
  });

  test('GET /api/items - Get all items', async () => {
    const res = await request(app)
      .get('/api/items')
      .set('Authorization', `Bearer ${global.testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('POST /api/items/:id/claim - Claim an item', async () => {
    const res = await request(app)
      .post(`/api/items/${itemId}/claim`)
      .set('Authorization', `Bearer ${global.testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.claimedById).toBeDefined();
  });

  test('PUT /api/items/:id/claim - Accept a claim', async () => {
    const res = await request(app)
      .put(`/api/items/${itemId}/claim`)
      .set('Authorization', `Bearer ${global.testToken}`)
      .send({ claimStatus: 'accepted' });

    expect(res.statusCode).toBe(200);
    expect(res.body.claimStatus).toBe('accepted');
  });
});