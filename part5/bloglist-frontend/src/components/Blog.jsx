import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, user, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isOwner = user && blog.user && (
    blog.user.username === user.username
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails
        ? (
          <div>
            <div>Title: {blog.title}</div>
            <div>URL: {blog.url}</div>
            <div>
              Likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
            </div>
            <div>Author: {blog.author}</div>
            {isOwner
              ? (
                <button onClick={() => handleDelete(blog)}>
                  delete
                </button>
              )
              : null
            }
          </div>
        )
        : null
      }
    </div>
  )
}
// commit 5.9: Blog List Frontend, step 9

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
