import request from 'supertest';
import { prisma } from '../lib/prisma.js';
import { app } from '../index.js';
import { signAccessToken } from '../lib/auth.js';

describe('Timesheet Lifecycle', () => {
  let adminUser;
  let staffUser;
  let department;
  let adminToken;
  let staffToken;

  beforeAll(async () => {
    // Clear test data
    await prisma.activityLog.deleteMany();
    await prisma.timesheet.deleteMany();
    await prisma.timeEntry.deleteMany();
    await prisma.taskTemplate.deleteMany();
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
  });

  beforeEach(async () => {
    // Create department
    department = await prisma.department.create({
      data: { name: 'Engineering', description: 'Test department' },
    });

    // Create admin user
    adminUser = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@example.com`,
        passwordHash: 'hashed-admin-password',
        fullName: 'Admin User',
        role: 'admin',
        departmentId: department.id,
      },
    });

    // Create staff user
    staffUser = await prisma.user.create({
      data: {
        email: `staff-${Date.now()}@example.com`,
        passwordHash: 'hashed-staff-password',
        fullName: 'Staff User',
        role: 'staff',
        departmentId: department.id,
      },
    });

    adminToken = signAccessToken(adminUser);
    staffToken = signAccessToken(staffUser);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Staff timesheet submission', () => {
    it('should fail to submit with 0 hours', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Next Monday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const response = await request(app)
        .post('/api/timesheets')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          user_id: staffUser.id,
          user_name: staffUser.fullName,
          department_id: department.id,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          total_hours: 0,
          status: 'pending',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Submit requires more than 0 hours for that week.');
    });

    it('should fail to submit with negative hours', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const response = await request(app)
        .post('/api/timesheets')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          user_id: staffUser.id,
          user_name: staffUser.fullName,
          department_id: department.id,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          total_hours: -1,
          status: 'pending',
        });

      expect(response.statusCode).toBe(400);
    });

    it('should successfully submit with > 0 hours', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const response = await request(app)
        .post('/api/timesheets')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          user_id: staffUser.id,
          user_name: staffUser.fullName,
          department_id: department.id,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          total_hours: 8,
          status: 'pending',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe('pending');
    });

    it('should create audit log on submission', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      await request(app)
        .post('/api/timesheets')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          user_id: staffUser.id,
          user_name: staffUser.fullName,
          department_id: department.id,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          total_hours: 8,
          status: 'pending',
        });

      const activityLogs = await prisma.activityLog.findMany({
        where: {
          userId: staffUser.id,
          action: 'Timesheet submitted',
        },
      });

      expect(activityLogs.length).toBe(1);
    });
  });

  describe('Admin approval/rejection', () => {
    it('should approve a pending timesheet', async () => {
      // First create a timesheet
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const timesheet = await prisma.timesheet.create({
        data: {
          userId: staffUser.id,
          userName: staffUser.fullName,
          departmentId: department.id,
          weekStart,
          weekEnd,
          status: 'pending',
          totalHours: 8,
        },
      });

      const response = await request(app)
        .patch(`/api/timesheets/${timesheet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'approved',
          reviewed_by: adminUser.id,
          reviewed_by_name: adminUser.fullName,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('approved');
    });

    it('should reject a pending timesheet with notes', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const timesheet = await prisma.timesheet.create({
        data: {
          userId: staffUser.id,
          userName: staffUser.fullName,
          departmentId: department.id,
          weekStart,
          weekEnd,
          status: 'pending',
          totalHours: 8,
        },
      });

      const response = await request(app)
        .patch(`/api/timesheets/${timesheet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'rejected',
          admin_notes: 'Please add more detailed descriptions for your time entries.',
          reviewed_by: adminUser.id,
          reviewed_by_name: adminUser.fullName,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('rejected');
      expect(response.body.admin_notes).toBe('Please add more detailed descriptions for your time entries.');
    });

    it('should create audit log on approval', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const timesheet = await prisma.timesheet.create({
        data: {
          userId: staffUser.id,
          userName: staffUser.fullName,
          departmentId: department.id,
          weekStart,
          weekEnd,
          status: 'pending',
          totalHours: 8,
        },
      });

      await request(app)
        .patch(`/api/timesheets/${timesheet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'approved',
          reviewed_by: adminUser.id,
          reviewed_by_name: adminUser.fullName,
        });

      const activityLogs = await prisma.activityLog.findMany({
        where: {
          userId: adminUser.id,
          action: 'Timesheet approved',
        },
      });

      expect(activityLogs.length).toBe(1);
    });

    it('should create audit log on rejection', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const timesheet = await prisma.timesheet.create({
        data: {
          userId: staffUser.id,
          userName: staffUser.fullName,
          departmentId: department.id,
          weekStart,
          weekEnd,
          status: 'pending',
          totalHours: 8,
        },
      });

      await request(app)
        .patch(`/api/timesheets/${timesheet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'rejected',
          admin_notes: 'Needs more details',
          reviewed_by: adminUser.id,
          reviewed_by_name: adminUser.fullName,
        });

      const activityLogs = await prisma.activityLog.findMany({
        where: {
          userId: adminUser.id,
          action: 'Timesheet rejected',
        },
      });

      expect(activityLogs.length).toBe(1);
    });
  });

  describe('Permission enforcement', () => {
    it('should prevent staff from approving timesheets', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const timesheet = await prisma.timesheet.create({
        data: {
          userId: staffUser.id,
          userName: staffUser.fullName,
          departmentId: department.id,
          weekStart,
          weekEnd,
          status: 'pending',
          totalHours: 8,
        },
      });

      const response = await request(app)
        .patch(`/api/timesheets/${timesheet.id}`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'approved',
          reviewed_by: staffUser.id,
          reviewed_by_name: staffUser.fullName,
        });

      expect(response.statusCode).toBe(403);
    });

    it('should prevent staff from creating timesheets for others', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const response = await request(app)
        .post('/api/timesheets')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          user_id: adminUser.id,
          user_name: adminUser.fullName,
          department_id: department.id,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          total_hours: 8,
          status: 'pending',
        });

      expect(response.statusCode).toBe(403);
    });
  });
});
