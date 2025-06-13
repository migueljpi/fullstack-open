import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

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
            <div>Likes: {blog.likes} <button>like</button></div>
            <div>Author: {blog.author}</div>
          </div>
        )
        : null
      }
    </div>
  )
}

export default Blog
