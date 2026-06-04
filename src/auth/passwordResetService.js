const bcrypt = require('bcrypt');
const PasswordResetToken = require('../models/PasswordResetToken');
const User = require('../models/User');

async function resetPassword(rawToken, newPassword) {
  const record = await PasswordResetToken.findOne({
    expiresAt: { $gt: new Date() }
  });

  if (!record) {
    throw new Error('Invalid or expired token');
  }

  const valid = await bcrypt.compare(rawToken, record.tokenHash);
  if (!valid) {
    throw new Error('Invalid or expired token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await User.updateOne({ _id: record.userId }, { passwordHash });

  await PasswordResetToken.deleteMany({ userId: record.userId });
}

module.exports = { resetPassword };
