const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})


blogsRouter.post('/', (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title and url are required' })
    }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter
