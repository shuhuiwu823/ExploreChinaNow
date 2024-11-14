import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
	const [isDropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen);
	};

	const closeDropdown = () => {
		setDropdownOpen(false);
	};

	return (
		<header style={headerStyle}>
			<div style={logoStyle}>
				<img src="/icon.png" alt="icon" style={iconStyle} />
				<h1 style={titleStyle}>ExploreChinaNow</h1>
			</div>
			<nav style={navStyle}>
				<Link to="/" style={linkStyle}>
					Home
				</Link>
				<Link to="/videos" style={linkStyle}>
					Video Recommendations
				</Link>
				<Link to="/map" style={linkStyle}>
					Map
				</Link>
				<Link to="/tour-plan" style={linkStyle}>
					Tour Plan (ChatGPT)
				</Link>
				<div style={dropdownStyle} onMouseEnter={toggleDropdown} onMouseLeave={closeDropdown}>
					<button style={dropdownButtonStyle}>Travel Tips</button>
					{isDropdownOpen && (
						<div style={dropdownContentStyle}>
							<Link to="/visa-policy" style={dropdownLinkStyle}>
								Visa Policy Info
							</Link>
							<Link to="/payment-setup" style={dropdownLinkStyle}>
								Payment Setup
							</Link>
						</div>
					)}
				</div>
				<Link to="/blogs" style={linkStyle}>
					Blogs
				</Link>
				<Link to="/sign-in" style={linkStyle}>
					Sign In
				</Link>
                <Link to="/sign-up" style={linkStyle}>
					Sign Up
				</Link>
			</nav>
		</header>
	);
}

const headerStyle = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: "10px 20px",
	backgroundColor: "#333",
	color: "#fff",
};

const logoStyle = {
	display: "flex",
	alignItems: "center",
};

const iconStyle = {
	width: "30px",
	height: "30px",
	marginRight: "10px",
};

const titleStyle = {
	fontSize: "24px",
	fontWeight: "bold",
};

const navStyle = {
	display: "flex",
	gap: "15px",
};

const linkStyle = {
	color: "#fff",
	textDecoration: "none",
	padding: "8px 12px",
	borderRadius: "4px",
};

const dropdownStyle = {
	position: "relative",
	display: "inline-block",
};

const dropdownButtonStyle = {
	backgroundColor: "#333",
	color: "#fff",
	border: "none",
	cursor: "pointer",
	padding: "8px 12px",
	borderRadius: "4px",
};

const dropdownContentStyle = {
	position: "absolute",
	backgroundColor: "#444",
	minWidth: "160px",
	boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
	zIndex: 1,
	borderRadius: "4px",
};

const dropdownLinkStyle = {
	color: "#fff",
	textDecoration: "none",
	display: "block",
	padding: "10px",
};

export default Header;
