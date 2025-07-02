import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const Blog = ({ blog }) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Link to={`/blogs/${blog.id}`} style={{ textDecoration: "none" }}>
          {blog.title} - {blog.author}
        </Link>
      </Card.Body>
    </Card>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
