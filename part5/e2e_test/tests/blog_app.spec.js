const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset DB and create user
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'sekret'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: "login" })).toBeVisible()
  })

  describe('Login', () => {
    test('logs in with correct credentials', async ({ page }) => {
      await loginWith(page)
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: "login" }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'blog can be created',
        author: 'Test Author',
        url: 'www.example.com'
      })
      await expect(page.locator('.blog', { hasText: 'blog can be created - Test Author' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'blog can be liked',
        author: 'Test Author',
        url: 'www.example.com'
      })

      const blog = page.locator('.blog', { hasText: 'blog can be liked - Test Author' })
      await blog.getByRole('button', { name: 'view' }).click()

      const likesLine = blog.locator('.blogDetails', { hasText: 'Likes:' })
      const likeButton = blog.locator('.blogDetails').getByRole('button', { name: 'like' })
      await likeButton.click()
      await expect(likesLine).toContainText('Likes: 1')
    })

    test('user can delete their own blog', async ({ page }) => {
      await createBlog(page, {
        title: 'blog to delete',
        author: 'Test Author',
        url: 'www.example.com'
      })
      const blog = page.locator('.blog', { hasText: 'blog to delete - Test Author' })
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: 'view' }).click()
      page.once('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'delete' }).click()
      await expect(blog).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page }) => {
      await createBlog(page, {
        title: 'blog only owner can delete',
        author: 'Test Author',
        url: 'www.example.com'
      })
      const blog = page.locator('.blog', { hasText: 'blog only owner can delete - Test Author' })
      await expect(blog).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByText('login')).toBeVisible()

      await loginWith(page, 'otheruser', 'sekret', 'Other User')
      await expect(page.getByText('Other User logged in')).toBeVisible()

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })

    test('blogs are ordered by likes (most likes first)', async ({ page }) => {
      await createBlog(page, {
        title: 'Least liked',
        author: 'A',
        url: 'www.a.com'
      })
      await expect(page.locator('.blog', { hasText: 'Least liked - A' })).toBeVisible()

      await createBlog(page, {
        title: 'Medium liked',
        author: 'B',
        url: 'www.b.com'
      })
      await expect(page.locator('.blog', { hasText: 'Medium liked - B' })).toBeVisible()

      await createBlog(page, {
        title: 'Most liked',
        author: 'C',
        url: 'www.c.com'
      })
      await expect(page.locator('.blog', { hasText: 'Most liked - C' })).toBeVisible()

      await likeBlog(page, 'Least liked', 1)
      await likeBlog(page, 'Medium liked', 2)
      await likeBlog(page, 'Most liked', 3)


      const blogTitles = await page.locator('.blog').allTextContents()
      expect(blogTitles[0]).toContain('Most liked')
      expect(blogTitles[1]).toContain('Medium liked')
      expect(blogTitles[2]).toContain('Least liked')
    })
  })
})
