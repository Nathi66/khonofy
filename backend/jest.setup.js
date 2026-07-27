// Setup test environment variables
process.env.NODE_ENV = 'test';
// Override DATABASE_URL for testing - use SQLite in-memory
process.env.DATABASE_URL = 'file:./test.db';

// Mock email sending for crypto
const crypto = require('node:crypto');
jest.mock('node:crypto', () => ({
  randomBytes: () => Buffer.from('test-reset-token-1234567890123456789012'),
  createHash: () => ({
    update: () => ({
      digest: () => 'hashed-test-token',
    }),
  }),
}));
