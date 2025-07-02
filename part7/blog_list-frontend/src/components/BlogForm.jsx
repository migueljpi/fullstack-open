import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Form onSubmit={addBlog}>
      <Form.Group className="mb-3">
        <Form.Label>title:</Form.Label>
        <Form.Control
          data-testid="title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>author:</Form.Label>
        <Form.Control
          data-testid="author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>url:</Form.Label>
        <Form.Control
          data-testid="url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mb-3">
        save
      </Button>
    </Form>
  );
};

export default BlogForm;
