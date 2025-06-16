import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  // click button
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  // showing?
  expect(screen.getByText('URL: www.test.com')).toBeDefined()
  expect(screen.getByText('Likes: 5')).toBeDefined()
})

test('calls like handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  const mockLikeHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockLikeHandler} />)

  // click button
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  // click like 2x
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})
