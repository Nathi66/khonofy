import request from 'supertest';
import { prisma } from '../lib/prisma.js';
import { app } from '../index.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Clear test data
    await prisma.activityLog.deleteMany();
    await prisma.timesheet.deleteMany();
    await prisma.timeEntry.deleteMany();
    await prisma.taskTemplate.deleteMany();
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'Password123!',
          fullName: 'Test User',
          phone: '+1234567890',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.role).toBe('staff');
    });

    it('should return 409 for duplicate email', async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      
      await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
        fullName: 'First User',
      });

      const response = await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
        fullName: 'Second User',
      });

      expect(response.statusCode).toBe(409);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login-test-${Date.now()}@example.com`;
      
      await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
        fullName: 'Login Test User',
      });

      const response = await request(app).post('/api/auth/login').send({
        email,
        password: 'Password123!',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(email);
    });

    it('should return 401 for invalid password', async () => {
      const email = `invalid-password-${Date.now()}@example.com`;
      
      await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
      });

      const response = await request(app).post('/api/auth/login').send({
        email,
        password: 'WrongPassword123!',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'Password123!',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should request password reset', async () => {
      const email = `reset-test-${Date.now()}@example.com`;
      
      await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
      });

      const response = await request(app).post('/api/auth/forgot-password').send({
        email,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBe(true);
    });

    it('should return ok even for non-existent user (security)', async () => {
      const response = await request(app).post('/api/auth/forgot-password').send({
        email: 'nonexistent@example.com',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      const email = `reset-complete-${Date.now()}@example.com`;
      
      await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
      });

      // Get reset token from database
      const user = await prisma.user.findUnique({ where: { email } });
      const resetToken = user.resetToken;
      
      const response = await request(app).post('/api/auth/reset-password').send({
        resetToken,
        newPassword: 'NewPassword123!',
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const email = `me-test-${Date.now()}@example.com`;
      
      const registerResponse = await request(app).post('/api/auth/register').send({
        email,
        password: 'Password123!',
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${registerResponse.body.access_token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe(email);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.statusCode).toBe(401);
    });
  });
});
