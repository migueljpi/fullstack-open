const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./blog_helper')
const Blog = require('../models/blog')


const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

})

test('returns the correct amount of blog posts in the json format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog posts have property named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert.ok(blog.id, 'Blog is missing id property')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id property')
  })
})

test('a valid blog can be added', async () => {
  const newBlog = helper.singleBlog

  const blogsStart = await api.get('/api/blogs')


  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsEnd.body.length, blogsStart.body.length + 1)

  console.log(blogsEnd.body)

  const titles = blogsEnd.body.map(b => b.title)
  assert.ok(titles.includes(newBlog.title), 'New blog title not found in database')
})

test.only('if likes property is missing, defaults to 0', async () => {
  const newBlog = helper.noLikes

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test.only('blog without title is not added and returns 400', async () => {
  const newBlog = helper.noTitle

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length)
})

test.only('blog without url is not added and returns 400', async () => {
  const newBlog = helper.noUrl

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
