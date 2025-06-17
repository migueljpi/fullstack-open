const loginWith = async (page, username = 'mluukkai', password = 'salainen', name = 'Matti Luukkainen') => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByText(`${name} logged in`)
}

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'save' }).click()
  await page.locator('.blog', { hasText: `${title} - ${author}` })
}

const likeBlog = async (page, title, times = 1) => {
  const blog = page.locator('.blog', { hasText: title })
  await blog.getByRole('button', { name: 'view' }).click()
  for (let i = 0; i < times; i++) {
    await blog.locator('.blogDetails').getByRole('button', { name: 'like' }).click()
    await page.waitForTimeout(200)
  }
}

module.exports = { loginWith, createBlog, likeBlog }
