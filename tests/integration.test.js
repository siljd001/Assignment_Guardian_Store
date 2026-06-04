// tests/integration.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Integration: Login Rate Limiting', () => {
  it('blocks excessive login attempts', async () => {
    for (let i = 0; i < 11; i++) {
      await request(app)
        .post('/login')
        .send({ email: 'bjoern@example.com', password: 'wrong' });
    }

    const res = await request(app)
      .post('/login')
      .send({ email: 'bjoern@example.com', password: 'wrong' });

    expect(res.status).toBe(429);
  });
});
