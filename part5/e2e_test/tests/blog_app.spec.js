const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      // Log in
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('blog can be created')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.locator('.blog', { hasText: 'blog can be created - Test Author' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'blog can be liked',
        author: 'Test Author',
        url: 'http://example.com'
      })

      const blog = page.locator('.blog', { hasText: 'blog can be liked - Test Author' })
      await blog.getByRole('button', { name: 'view' }).click()

      const likesLine = blog.locator('.blogDetails', { hasText: 'Likes:' })


      const likeButton = blog.locator('.blogDetails').getByRole('button', { name: 'like' })
      await likeButton.click()

      await expect(likesLine).toContainText('Likes: 1')
    })

    test('user can delete their own blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('blog to delete')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'save' }).click()
      const blog = page.locator('.blog', { hasText: 'blog to delete - Test Author' }).last()
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => dialog.accept())

      await blog.getByRole('button', { name: 'delete' }).click()

      await expect(blog).not.toBeVisible()
    })
  })
})
