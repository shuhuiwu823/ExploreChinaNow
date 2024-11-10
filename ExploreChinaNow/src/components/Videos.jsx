import { useState } from "react";

const VideosPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedVideoId, setSelectedVideoId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

	// YouTube API key (replace with your own key)
	const API_KEY = "AIzaSyAiO6QfiiAJDRzM0YhqdwEYHBJeyO_7crQ";

	// Initial video IDs and titles (for default videos)
	const initialVideos = [
		{ id: "Uuwdv2FZOwU", title: "Exploring China: Amazing Travel Destinations" },
		{ id: "tpk2mF9AEZo", title: "Top 10 Must-Visit Places in China" },
		{ id: "NJl5lvkJCd0", title: "A Beautiful Journey Through China" },
		{ id: "33bZIOLX4do", title: "Hidden Gems of China: Travel Guide" },
		{ id: "b5FtjD2I8es", title: "China Adventure: Exploring the Great Wall" },
		{ id: "1aYcFjsEULM", title: "Amazing Chinese Culture and Travel Spots" },
	];

	// Handle search on button click
	const handleSearch = async () => {
		if (!searchQuery) return;

		setLoading(true);
		try {
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchQuery}&maxResults=6&key=${API_KEY}`
			);
			const data = await response.json();
			setVideos(data.items); // Set the video results to state
		} catch (error) {
			console.error("Error fetching YouTube data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Handle search on "Enter" key press
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Handle video click to open modal
	const openModal = (videoId) => {
		setSelectedVideoId(videoId);
		setIsModalOpen(true);
	};

	// Handle modal close
	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedVideoId(null);
	};

	return (
		<div style={{ textAlign: "center" }}>
			{/* <h2>China Travel Vlogs</h2> */}
			<h1>Explore China: The Best Travel Videos</h1>
			<p>Your next adventure starts here</p>
			{/* Search Bar */}
			<div>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyDown} // Trigger search on 'Enter' key press
					placeholder="Enter keywords..."
					style={{
						padding: "10px",
						width: "300px",
						marginRight: "10px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				/>
				<button
					onClick={handleSearch}
					style={{
						padding: "10px 20px",
						borderRadius: "4px",
						backgroundColor: "#4CAF50",
						color: "white",
						border: "none",
						cursor: "pointer",
					}}>
					Search
				</button>
			</div>
			<br />
			{/* Loading Indicator */}
			{loading && <p>Loading...</p>}

			{/* Display Videos */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)", // 3 videos per row
					gap: "20px",
					maxWidth: "960px",
					margin: "0 auto",
				}}>
				{videos.length === 0 &&
					!loading &&
					// Default 6 videos when no search is performed
					initialVideos.map((video) => (
						<div
							key={video.id}
							onClick={() => openModal(video.id)} // Open modal on click
							style={{
								cursor: "pointer",
								maxWidth: "300px",
								borderRadius: "8px",
								overflow: "hidden",
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
								textAlign: "left",
							}}>
							<div
								style={{
									position: "relative",
									width: "100%",
									height: "200px", // Fixed height for uniformity
								}}>
								<img
									src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
									alt="YouTube Video Thumbnail"
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover", // Ensures the image covers the entire space without distortion
										borderRadius: "8px",
										transition: "transform 0.3s",
									}}
								/>
							</div>
							<div style={{ padding: "10px", fontSize: "14px" }}>
								<strong>{video.title}</strong>
							</div>
						</div>
					))}

				{/* Display search results */}
				{!loading &&
					videos.length > 0 &&
					videos.map((video) => (
						<div
							key={video.id.videoId}
							onClick={() => openModal(video.id.videoId)} // Open modal on click
							style={{
								cursor: "pointer",
								maxWidth: "300px",
								borderRadius: "8px",
								overflow: "hidden",
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
								textAlign: "left",
							}}>
							<div
								style={{
									position: "relative",
									width: "100%",
									height: "200px", // Fixed height for uniformity
								}}>
								<img
									src={video.snippet.thumbnails.medium.url}
									alt={video.snippet.title}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover", // Ensures the image covers the entire space without distortion
										borderRadius: "8px",
										transition: "transform 0.3s",
									}}
								/>
							</div>
							<div style={{ padding: "10px", fontSize: "14px" }}>
								<strong>{video.snippet.title}</strong>
							</div>
						</div>
					))}
			</div>

			{/* Modal to show the selected video */}
			{isModalOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.7)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}>
					<div
						style={{
							position: "relative",
							backgroundColor: "black",
							// padding: "5px",
							borderRadius: "8px",
							width: "80%",
							maxWidth: "800px",
						}}>
						<iframe
							width="100%"
							height="450"
							src={`https://www.youtube.com/embed/${selectedVideoId}`}
							title="YouTube video player"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen></iframe>
						<button
							onClick={closeModal}
							style={{
								position: "absolute",
								top: "10px",
								right: "10px",
								padding: "10px 10px",
								backgroundColor: "rgba(256, 0, 0, 0.9)",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Footer Section */}
			{/* <footer style={{ padding: "20px", backgroundColor: "#333", color: "white", textAlign: "center" }}>
				<p>&copy; 2024 Explore China. All rights reserved.</p>
				<div>
					<a href="/privacy-policy" style={{ color: "white", marginRight: "10px" }}>
						Privacy Policy
					</a>
					<a href="/terms" style={{ color: "white" }}>
						Terms of Use
					</a>
				</div>
			</footer> */}
		</div>
	);
};

export default VideosPage;
