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

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})

module.exports = blogsRouter
