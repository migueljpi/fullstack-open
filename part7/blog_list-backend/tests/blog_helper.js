const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
  },
  {
    title: 'Test Blog 2',
    author: 'Test Author 2',
    url: 'http://testblog.com',
    likes: 5,
  },
  {
    title: 'Test Blog 3',
    author: 'Test Author 3',
    url: 'http://testblog.com',
    likes: 5,
  },
  {
    title: 'Test Blog 4',
    author: 'Test Author 4',
    url: 'http://testblog.com',
    likes: 5,
  },
  {
    title: 'Test Blog 5',
    author: 'Test Author 5',
    url: 'http://testblog.com',
    likes: 5,
  },
]

const singleBlog = {
    title: 'aditional blog',
    author: 'Tester additional',
    url: 'http://additional.com',
    likes: 10,
  }

const noLikes = {
  title: 'No Likes Blog',
  author: 'No Likes Author',
  url: 'http://nolikes.com'
}

const noTitle = {
  author: 'No Title Author',
  url: 'http://notitle.com',
  likes: 1
}

const noUrl = {
  title: 'No URL Blog',
  author: 'No URL Author',
  likes: 1
}


module.exports = {
  initialBlogs, singleBlog, noLikes, noTitle, noUrl
}
