import {
  Navbar,
  Container,
  Nav,
  Button,
  Form,
  FormControl,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NavigationBar = ({
  user,
  onLoggedOut,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setSearchTerm('')}>
          myFlix
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* Add the search input field and clear button */}
            {user && (
              <>
                <Form inline className="d-flex">
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="outline-light"
                      onClick={() => setSearchTerm('')}
                    >
                      X
                    </Button>
                  )}
                </Form>
              </>
            )}
          </Nav>
          <Nav className="ms-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link as={Link} to="/" onClick={() => setSearchTerm('')}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to={`/users/${user.username}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
