const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Notification = require('../models/notification');
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

describe('Notification Routes', () => {
  let notificationId;

  test('GET /api/notifications - Get notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${global.testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('PUT /api/notifications/:id/read - Mark notification as read', async () => {
    // Create a test notification
    const notification = new Notification({
      userId: global.testUserId,
      itemId: mongoose.Types.ObjectId(),
      message: 'Test notification'
    });
    await notification.save();
    notificationId = notification._id;

    const res = await request(app)
      .put(`/api/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${global.testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.isRead).toBe(true);
  });
});