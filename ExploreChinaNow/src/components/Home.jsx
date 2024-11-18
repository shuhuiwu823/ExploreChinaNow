// import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();

	return (
		<Container fluid="lg">
			<Row className="my-5 align-items-center text-center">
				<Col
					md={12}
					style={{
						backgroundImage: `url('https://gd-hbimg.huaban.com/d8cd499d1969c02d07e1c7c91a95094cad0c713d102d3c-Jg3Tg3_fw1200webp')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						height: "400px", // Set a specific height for better control
						paddingLeft: "0", // Remove padding on the left
						paddingRight: "0", // Remove padding on the right
					}}>
					<div
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.4)", // Lighter gray overlay for a subtle effect
							width: "100%",
							height: "100%",
							color: "white",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							padding: "20px",
						}}>
						<h1>Welcome to ExploreChinaNow!</h1>
						<p className="lead">Discover the Beauty and Diversity of China</p>
						<p>
							Welcome to your ultimate resource for traveling and exploring China! Whether you are planning your first
							trip or you are a seasoned traveler returning for more adventures, ExploreChinaNow is your gateway to
							uncovering the most stunning destinations, vibrant cultures, and hidden treasures of China.
						</p>
					</div>
				</Col>
			</Row>

			<Row className="text-center my-4">
				<Col>
					<h2 className="text">Traveling – it leaves you speechless, then turns you into a storyteller.</h2>
					<p>Embark on a journey through China and let your experiences tell the story.</p>
				</Col>
			</Row>

			<Row>
				<Col md={4}>
					<Card className="mb-4">
						<Card.Img
							variant="top"
							src="https://gd-hbimg.huaban.com/42953a6d5006760dfed01793deb8b97c93dbb86513c31c-yHdJbF_fw1200webp"
							style={{ height: "400px", objectFit: "cover" }}
						/>
						<Card.Body>
							<Card.Title>Video Recommendations</Card.Title>
							<Card.Text>
								Dive into our curated selection of travel videos that bring the scenic landscapes and bustling
								cityscapes of China right to your screen.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="mb-4">
						<Card.Img
							variant="top"
							src="https://gd-hbimg.huaban.com/41cbb8e6d5b0da25f6e471c4cc3a3de5d67d949a2171f9-An4B71_fw1200webp"
							style={{ height: "400px", objectFit: "cover" }}
						/>
						<Card.Body>
							<Card.Title>Interactive Map</Card.Title>
							<Card.Text>
								Navigate through our interactive map to find detailed information about various attractions, local
								eateries, and must-visit sites.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="mb-4">
						<Card.Img
							variant="top"
							src="https://gd-hbimg.huaban.com/277028bc6a1acf16e560ef27c00056f055652aef25d7da-bJnVgv_fw1200webp"
							style={{ height: "400px", objectFit: "cover" }}
						/>
						<Card.Body>
							<Card.Title>Tour Planner</Card.Title>
							<Card.Text>
								Utilize our comprehensive tour planning tool to create a custom itinerary that fits your schedule,
								budget, and interests.
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row style={{ marginTop: "60px", marginBottom: "60px" }} className="align-items-center">
				<Col md={6} className="d-flex flex-column justify-content-center pr-4">
					<h2>Latest Blogs</h2>
					<p>
						Read through our blogs to get personal stories from other travelers, detailed guides, and expert advice on
						making the most of your trip to China.
					</p>
					<div>
						{" "}
						{/* Encapsulate Button in a div to avoid flex-grow */}
						<Button variant="primary">Read Our Blogs</Button>
					</div>
				</Col>
				<Col md={6} className="pl-4">
					<img
						src="https://plus.unsplash.com/premium_photo-1683120768716-d4242ac2ea4c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Blog"
						className="img-fluid rounded"
						style={{ width: "100%", height: "400px", objectFit: "cover" }}
					/>
				</Col>
			</Row>
			<Row style={{ marginTop: "60px", marginBottom: "60px" }} className="align-items-center">
				<Col md={6} className="pr-4">
					<img
						src="https://images.unsplash.com/photo-1444210971048-6130cf0c46cf?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Travel Community"
						className="img-fluid rounded"
						style={{ width: "100%", height: "400px", objectFit: "cover" }}
					/>
				</Col>
				<Col md={6} className="pl-4 d-flex flex-column justify-content-center">
					<h2>Join Our Community</h2>
					<p>
						Connect, Share, and Learn with Fellow Travel Enthusiasts. Sign in or create an account today to join
						discussions and get personalized travel recommendations.
					</p>
					<div>
						{" "}
						{/* Wrap the buttons to protect their sizing */}
						<Button variant="success" onClick={() => navigate("/sign-in")}>
							Sign In
						</Button>
						{/* <Button variant="secondary" className="ml-2">
							Sign Up
						</Button> */}
					</div>
				</Col>
			</Row>

			<Row style={{ marginTop: "60px", marginBottom: "60px" }} className="align-items-center">
				<Col md={6} className="pr-4 d-flex flex-column justify-content-center">
					<h2>Ready to Explore?</h2>
					<p>
						Whether you are looking for a tranquil retreat or an action-packed adventure, begin your journey here with
						us. Check out our videos, read the latest blogs, and start planning your trip with our easy-to-use tools.
						China awaits you!
					</p>
					<div>
						{" "}
						{/* Wrap the button to protect its sizing */}
						<Button variant="info" onClick={() => navigate("/tour-plan")}>
							Start Planning Your Adventure
						</Button>
					</div>
				</Col>
				<Col md={6} className="pl-4">
					<img
						src="https://gd-hbimg.huaban.com/0fe64c469aa5d2aa762cb569608f89ab1f863984ff7c3-JendhA_fw1200webp"
						alt="Explore"
						className="img-fluid rounded"
						style={{ width: "100%", height: "400px", objectFit: "cover" }}
					/>
				</Col>
			</Row>
		</Container>
	);
}

export default HomePage;
