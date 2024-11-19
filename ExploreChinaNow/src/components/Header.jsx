import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { signOut } from "firebase/auth";
import { AppContext } from "../Context";
import { auth } from "../firebase";
import "./Header.css";

function Header() {
	const { loading, userData, setUserData } = useContext(AppContext);
	const navigate = useNavigate();
	const location = useLocation(); // Get the current path

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				setUserData(null); // Clear user data after logout
				navigate("/"); // Navigate back to the home page
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleNavigation = (path) => {
		if (path === "/blogs") {
			if (location.pathname === "/blogs") {
				// Already on the /blogs page, refresh the page
				window.location.reload();
			} else {
				// Navigate to the /blogs page
				navigate(path);
			}
		} else {
			// Normal navigation for other paths
			navigate(path);
		}
	};

	return (
		<header>
		<Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
			<Container>
				<LinkContainer to="/">
					<Navbar.Brand>
						<img
							src="/icon.png"
							width="30"
							height="30"
							className="d-inline-block align-top"
							alt="icon"
							id="logo"
						/>{" "}
						ExploreChinaNow
					</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link onClick={() => handleNavigation("/")}>Home</Nav.Link>
						<Nav.Link onClick={() => handleNavigation("/videos")}>Videos</Nav.Link>
						<Nav.Link onClick={() => handleNavigation("/map")}>Map</Nav.Link>
						<Nav.Link onClick={() => handleNavigation("/tour-plan")}>Tour Plan</Nav.Link>
						<NavDropdown title="Travel Tips" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => handleNavigation("/visa-policy")}>
								Visa Policy Info
							</NavDropdown.Item>
							<NavDropdown.Item onClick={() => handleNavigation("/payment-setup")}>
								Payment Setup
							</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link onClick={() => handleNavigation("/blogs")}>Blogs</Nav.Link>
						{userData ? (
							<>
								<Nav.Link onClick={() => handleNavigation("/profile")}>
									<img
										className="avatar-img"
										src={userData.avatar}
										alt={userData.username}
									/>
								</Nav.Link>
								<Nav.Link onClick={handleLogout} disabled={loading}>
									{loading ? "Loading..." : "Logout"}
								</Nav.Link>
							</>
						) : (
							<>
								<Nav.Link onClick={() => handleNavigation("/sign-in")}>
									Sign In
								</Nav.Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
		</header>
	);
}

export default Header;
