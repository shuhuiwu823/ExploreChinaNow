import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const VideosPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedVideoId, setSelectedVideoId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const location = useLocation();

	// Extract selectedCity from location state if available
	useEffect(() => {
		if (location.state && location.state.selectedCity) {
			const cityQuery = `${location.state.selectedCity}`;
			setSearchQuery(cityQuery);
			handleCitySearch(cityQuery); // Automatically trigger search when city is selected
		}
	}, [location.state]); // Depend on location.state to re-run this effect when it changes

	// YouTube API key (replace with your own key)
	const API_KEY = "AIzaSyAiO6QfiiAJDRzM0YhqdwEYHBJeyO_7crQ";

	// Updated initial videos to show 9 default videos
	const initialVideos = [
		{ id: "Uuwdv2FZOwU", title: "Exploring China: Amazing Travel Destinations" },
		{ id: "tpk2mF9AEZo", title: "Top 10 Must-Visit Places in China" },
		{ id: "NJl5lvkJCd0", title: "A Beautiful Journey Through China" },
		{ id: "33bZIOLX4do", title: "Hidden Gems of China: Travel Guide" },
		{ id: "b5FtjD2I8es", title: "China Adventure: Exploring the Great Wall" },
		{ id: "1aYcFjsEULM", title: "Amazing Chinese Culture and Travel Spots" },
		{
			id: "g7gzq9j8f3E",
			title: "48h in China's Silicon Valley 🇨🇳 China Is Living in the Future! (Shenzhen or California?)",
		},
		{ id: "OqwOdurjbdY", title: "What I Love and Hate About China | Travel Vlog" },
		{ id: "gQysLy32dFg", title: "FIRST TIME in HONG KONG 🇭🇰 (not what we expected)" },
	];

	// Function to handle search directly with city name
	const handleCitySearch = async (city) => {
		setSearchQuery(`${city} travel vlog`);
		setLoading(true);
		try {
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${city} travel vlog&maxResults=9&key=${API_KEY}`
			);
			const data = await response.json();
			setVideos(data.items);
		} catch (error) {
			console.error("Error fetching YouTube data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = async () => {
		if (!searchQuery) return;

		setLoading(true);
		try {
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchQuery}&maxResults=9&key=${API_KEY}`
			);
			const data = await response.json();
			setVideos(data.items);
		} catch (error) {
			console.error("Error fetching YouTube data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const openModal = (videoId) => {
		setSelectedVideoId(videoId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedVideoId(null);
	};

	return (
		<div style={{ textAlign: "center" }}>
			<br />
			<br />
			<h1>Explore The Best Travel Videos</h1>
			<p>Your next adventure starts here</p>

			<div>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Enter keywords..."
					style={{
						padding: "10px",
						width: "400px",
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
						backgroundColor: "#212529",
						color: "white",
						border: "none",
						cursor: "pointer",
					}}>
					Search
				</button>
			</div>
			<div style={{ margin: "20px" }}>
				<span>Popular Search: </span>
				{["Beijing", "Shanghai", "Guangzhou", "Shenzhen"].map((city) => (
					<a
						key={city}
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handleCitySearch(city);
						}}
						style={{
							padding: "10px 10px",
							// marginLeft: "2px",
							color: "#007bff", // Bootstrap default link color
							textDecoration: "none",
							cursor: "pointer",
						}}>
						{city}
					</a>
				))}
			</div>

			<br />

			{loading && <p>Loading...</p>}

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)", // Keep 3 columns for the grid
					gap: "30px", // Increase the gap between the videos
					maxWidth: "1200px", // Increase max width of the grid
					margin: "0 auto",
				}}>
				{videos.length === 0 &&
					!loading &&
					initialVideos.map((video) => (
						<div
							key={video.id}
							onClick={() => openModal(video.id)}
							style={{
								cursor: "pointer",
								width: "350px", // Increased width
								borderRadius: "8px",
								overflow: "hidden",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow
								textAlign: "left",
							}}>
							<div
								style={{
									position: "relative",
									width: "350px", // Increased width
									height: "196px", // Adjusted height to match aspect ratio
								}}>
								<img
									src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} // Use mqdefault for 320x180 size
									alt="YouTube Video Thumbnail"
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover", // Ensures consistent appearance
										borderRadius: "8px",
										transition: "transform 0.3s",
									}}
								/>
							</div>
							<div style={{ padding: "12px", fontSize: "16px" }}>
								<strong>{video.title}</strong>
							</div>
						</div>
					))}

				{!loading &&
					videos.length > 0 &&
					videos.map((video) => (
						<div
							key={video.id.videoId}
							onClick={() => openModal(video.id.videoId)}
							style={{
								cursor: "pointer",
								width: "350px", // Increased width
								borderRadius: "8px",
								overflow: "hidden",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow
								textAlign: "left",
							}}>
							<div
								style={{
									position: "relative",
									width: "350px", // Increased width
									height: "196px", // Adjusted height to match aspect ratio
								}}>
								<img
									src={video.snippet.thumbnails.medium.url}
									alt={video.snippet.title}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover", // Ensures consistent appearance
										borderRadius: "8px",
										transition: "transform 0.3s",
									}}
								/>
							</div>
							<div style={{ padding: "12px", fontSize: "16px" }}>
								<strong>{video.snippet.title}</strong>
							</div>
						</div>
					))}
			</div>

			<br />

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
		</div>
	);
};

export default VideosPage;
