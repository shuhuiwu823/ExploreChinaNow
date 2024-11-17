import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { signOut } from "firebase/auth";
import { AppContext } from "../Context";
import { auth } from "../firebase";

function Header() {
	const { loading, userData, setUserData } = useContext(AppContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				setUserData(null);
				navigate("/");
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
			<Container>
				<Navbar.Brand href="/">
					<img src="/icon.png" width="30" height="30" className="d-inline-block align-top" alt="icon" /> ExploreChinaNow
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						<LinkContainer to="/">
							<Nav.Link>Home</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/videos">
							<Nav.Link>Video Recommendations</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/map">
							<Nav.Link>Map</Nav.Link>
						</LinkContainer>
						<LinkContainer to="/tour-plan">
							<Nav.Link>Tour Plan (ChatGPT)</Nav.Link>
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
						{userData ? (
							<>
								<LinkContainer to="/profile">
									<Nav.Link>
										<img className="avatar-img" src={userData.avatar} alt={userData.username} />
									</Nav.Link>
								</LinkContainer>
								<Nav.Link onClick={handleLogout} disabled={loading}>
									{loading ? "Loading..." : "Logout"}
								</Nav.Link>
							</>
						) : (
							<>
								<LinkContainer to="/sign-in">
									<Nav.Link>Sign In</Nav.Link>
								</LinkContainer>
								<LinkContainer to="/sign-up">
									<Nav.Link>Sign Up</Nav.Link>
								</LinkContainer>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
