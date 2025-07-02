import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const Navigation = ({ user, handleLogout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto container">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex gap-3">
              <Nav.Link href="#" as="span">
                <Link className="nav-link" to="/">
                  Blogs
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </Nav.Link>
            </div>
            <div className="d-flex gap-3">
              <Nav.Link href="#" as="span">
                {user ? (
                  <div className="d-flex align-items-center gap-2">
                    <em className="nav-link">{user.name} logged in</em>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : null}
              </Nav.Link>
            </div>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
