# Backend Testing

## Setup

Install dependencies:
```bash
npm install
```

Set up test database (optional, defaults to DATABASE_URL):
```bash
export TEST_DATABASE_URL="postgresql://..."
```

## Running Tests

Run all tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

With coverage:
```bash
npm run test:coverage
```

## Test Files

- `src/test/auth.test.js` - Authentication endpoint tests
- `src/test/timesheet.test.js` - Timesheet lifecycle tests

## Writing Tests

Tests use Jest and Supertest. Example:

```javascript
import request from 'supertest';
import { prisma } from '../lib/prisma.js';
import { app } from '../index.js';

describe('My Feature', () => {
  it('should do something', async () => {
    const response = await request(app).get('/api/my-endpoint');
    expect(response.statusCode).toBe(200);
  });
});
```
