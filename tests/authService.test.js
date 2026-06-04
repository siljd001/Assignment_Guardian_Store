// tests/authService.test.js
const bcrypt = require('bcrypt');
const { login } = require('../src/auth/authService');
const User = require('../src/models/User');

jest.mock('../src/models/User');

describe('Authentication Service', () => {
  it('rejects login when user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(login('bjoern@example.com', 'wrongpass'))
      .rejects.toThrow('Invalid credentials');
  });

  it('rejects login with incorrect password', async () => {
    const hash = await bcrypt.hash('CorrectPassword123!', 12);
    User.findOne.mockResolvedValue({ id: '1', email: 'bjoern@example.com', passwordHash: hash });

    await expect(login('bjoern@example.com', 'WrongPassword'))
      .rejects.toThrow('Invalid credentials');
  });

  it('returns JWT token on successful login', async () => {
    const hash = await bcrypt.hash('CorrectPassword123!', 12);
    User.findOne.mockResolvedValue({ id: '1', email: 'bjoern@example.com', passwordHash: hash });

    const result = await login('bjoern@example.com', 'CorrectPassword123!');
    expect(result.token).toBeDefined();
  });
});
