const request = require('supertest');
const app = require('../src/app');

describe('Student API', () => {
  test('GET /health returns UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('GET /students returns a list', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('POST /students creates a student', async () => {
    const payload = { name: 'Test User', email: 'test@example.com', course: 'DevOps' };
    const res = await request(app).post('/students').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body.id).toBeDefined();
  });

  test('POST /students with missing fields returns 400', async () => {
    const res = await request(app).post('/students').send({ name: 'No Email' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /students/:id returns 404 for unknown student', async () => {
    const res = await request(app).get('/students/9999');
    expect(res.statusCode).toBe(404);
  });

  test('PUT then DELETE a student', async () => {
    const created = await request(app).post('/students')
      .send({ name: 'Temp', email: 't@example.com', course: 'Math' });
    const id = created.body.id;

    const updated = await request(app).put(`/students/${id}`)
      .send({ name: 'Temp Updated', email: 't@example.com', course: 'Physics' });
    expect(updated.statusCode).toBe(200);
    expect(updated.body.course).toBe('Physics');

    const del = await request(app).delete(`/students/${id}`);
    expect(del.statusCode).toBe(204);
  });
});
