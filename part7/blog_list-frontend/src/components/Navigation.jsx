import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const Navigation = ({ user, handleLogout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link style={{ color: "white", textDecoration: "none" }} to="/">
              blogs
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to="/users"
            >
              users
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {user ? (
              <>
                <em style={{ color: "white", marginRight: "10px" }}>
                  {user.name} logged in
                </em>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  logout
                </Button>
              </>
            ) : null}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
