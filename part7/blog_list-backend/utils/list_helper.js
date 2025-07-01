const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author') // creates a "hash" of authors and the number of blogs written by them

  const topAuthor = _.maxBy(Object.keys(counts), author => counts[author]) // firt argument is an array with the name of the authors (created by the counts), second argument is a function that returns the number of blogs for each author

  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author') // creates a group of blogs by author

  const authorLikes = Object.keys(grouped).map(author => ({
    author,
    likes: grouped[author].reduce((sum, blog) => sum + blog.likes, 0)
  })) // maps into an hash of authors and it total number of likes (sum)

  return _.maxBy(authorLikes, 'likes') // reurn the author with the most likes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
