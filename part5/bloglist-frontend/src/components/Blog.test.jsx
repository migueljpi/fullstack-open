import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  // showing
  expect(screen.getByText(`Test Blog - Test Author`)).toBeDefined()
  // not showing
  expect(screen.queryByText('www.test.com')).toBeNull()
  expect(screen.queryByText('5')).toBeNull()
})
