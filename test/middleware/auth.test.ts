import request from 'supertest';
import app from '../../src/app';
import admin from '../../src/config/firebase';

jest.mock('../../src/config/firebase', () => {
  const mAuth = {
    verifyIdToken: jest.fn()
  };
  return { auth: () => mAuth, default: { auth: () => mAuth } };
});

describe('Auth middleware and protected endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when missing Authorization header', async () => {
    const res = await request(app).get('/api/v1/loans');
    expect(res.status).toBe(401);
    expect(res.body.error?.message || res.body.message).toBeDefined();
  });

  it('allows request with valid token', async () => {
    // @ts-ignore
    admin.auth().verifyIdToken.mockResolvedValue({ uid: 'test-uid', role: 'officer' });

    const res = await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
