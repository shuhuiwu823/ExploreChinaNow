import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Header() {
	return (
		<Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
			<Container>
				<Navbar.Brand href="/">
					<img src="/icon.png" width="30" height="30" className="d-inline-block align-top" alt="icon" /> ExploreChinaNow
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						{" "}
						{/* Change here to push items to the right */}
						<LinkContainer to="/">
							<Nav.Link>Home</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/videos">
							<Nav.Link>Videos</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/map">
							<Nav.Link>Map</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/tour-plan">
							<Nav.Link>Tour Plan</Nav.Link>
						</LinkContainer>
						<NavDropdown title="Travel Tips" id="collasible-nav-dropdown">
							<LinkContainer to="/visa-policy">
								<NavDropdown.Item>Visa Policy Info</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to="/payment-setup">
								<NavDropdown.Item>Payment Setup</NavDropdown.Item>
							</LinkContainer>
						</NavDropdown>
						<LinkContainer to="/blogs">
							<Nav.Link>Blogs</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/sign-in">
							<Nav.Link>Sign In</Nav.Link>
						</LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
