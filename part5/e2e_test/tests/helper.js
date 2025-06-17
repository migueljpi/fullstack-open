const loginWith = async (page, username = 'mluukkai', password = 'salainen', name = 'Matti Luukkainen') => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByText(`${name} logged in`).waitFor()
}

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'save' }).click()
  await page.locator('.blog', { hasText: `${title} - ${author}` }).waitFor()
}

module.exports = { loginWith, createBlog }
