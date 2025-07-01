import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("calls createBlog with correct details when form is submitted", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  // get all inputs
  const inputs = screen.getAllByRole("textbox");
  // Assuming order: title, author, url
  await user.type(inputs[0], "Test Blog");
  await user.type(inputs[1], "Test Author");
  await user.type(inputs[2], "www.test.com");

  const saveButton = screen.getByText("save");
  await user.click(saveButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Test Blog",
    author: "Test Author",
    url: "www.test.com",
  });
});
