// tests/passwordReset.test.js
const bcrypt = require('bcrypt');
const { resetPassword } = require('../src/auth/passwordResetService');
const PasswordResetToken = require('../src/models/PasswordResetToken');
const User = require('../src/models/User');

jest.mock('../src/models/PasswordResetToken');
jest.mock('../src/models/User');

describe('Password Reset Service', () => {
  it('fails when token is invalid or expired', async () => {
    PasswordResetToken.findOne.mockResolvedValue(null);

    await expect(resetPassword('invalidtoken', 'NewPass123!'))
      .rejects.toThrow('Invalid or expired token');
  });

  it('resets password when token is valid', async () => {
    const rawToken = 'validtoken';
    const tokenHash = await bcrypt.hash(rawToken, 12);

    PasswordResetToken.findOne.mockResolvedValue({
      userId: '123',
      tokenHash,
      expiresAt: new Date(Date.now() + 10000)
    });

    User.updateOne.mockResolvedValue({});
    PasswordResetToken.deleteMany.mockResolvedValue({});

    await resetPassword(rawToken, 'NewPass123!');

    expect(User.updateOne).toHaveBeenCalled();
    expect(PasswordResetToken.deleteMany).toHaveBeenCalledWith({ userId: '123' });
  });
});
