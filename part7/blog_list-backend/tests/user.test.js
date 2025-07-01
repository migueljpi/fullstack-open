const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const assert = require('node:assert')
const { test, beforeEach } = require('node:test')

beforeEach(async () => {
  await User.deleteMany({})
  await api.post('/api/users').send({
    username: 'existinguser',
    name: 'Existing User',
    password: 'password123'
  })
})

test('creation fails if username is missing', async () => {
  const result = await api
    .post('/api/users')
    .send({ name: 'NoUsername', password: 'password123' })
    .expect(400)
  assert.ok(result.body.error.includes('username and password are required'))
})

test('creation fails if password is missing', async () => {
  const result = await api
    .post('/api/users')
    .send({ username: 'nopassword', name: '123456' })
    .expect(400)
  assert.ok(result.body.error.includes('username and password are required'))
})

test('creation fails if username is too short', async () => {
  const result = await api
    .post('/api/users')
    .send({ username: 'as', name: 'ShortUsername', password: 'password123' })
    .expect(400)
  assert.ok(result.body.error.includes('at least 3 characters'))
})

test('creation fails if password is too short', async () => {
  const result = await api
    .post('/api/users')
    .send({ username: 'validuser', name: 'Short assword', password: 'pw' })
    .expect(400)
  assert.ok(result.body.error.includes('at least 3 characters'))
})

test('creation fails if username is not unique', async () => {
  const result = await api
    .post('/api/users')
    .send({ username: 'existinguser', name: 'Duplicate', password: 'password123' })
    .expect(400)
  assert.ok(result.body.error.includes('unique'))
})
