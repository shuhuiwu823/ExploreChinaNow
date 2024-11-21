import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../components/Home";

// Mock the useNavigate hook from react-router-dom
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(), // Mock useNavigate
	};
});

describe("HomePage Component", () => {
	it("renders the main welcome message", () => {
		render(
			<MemoryRouter>
				<HomePage />
			</MemoryRouter>
		);

		expect(screen.getByText("Welcome to ExploreChinaNow!")).toBeInTheDocument();
		expect(screen.getByText("Discover the Beauty and Diversity of China")).toBeInTheDocument();
	});

	it("renders travel inspiration text", () => {
		render(
			<MemoryRouter>
				<HomePage />
			</MemoryRouter>
		);

		expect(
			screen.getByText("Traveling – it leaves you speechless, then turns you into a storyteller.")
		).toBeInTheDocument();
		expect(
			screen.getByText("Embark on a journey through China and let your experiences tell the story.")
		).toBeInTheDocument();
	});

	it("renders the feature cards", () => {
		render(
			<MemoryRouter>
				<HomePage />
			</MemoryRouter>
		);

		const cardTitles = ["Video Recommendations", "Interactive Map", "Tour Planner"];
		cardTitles.forEach((title) => {
			expect(screen.getByText(title)).toBeInTheDocument();
		});
	});

	it("renders all images with correct alt text", () => {
		render(
			<MemoryRouter>
				<HomePage />
			</MemoryRouter>
		);

		const images = [
			{ alt: "Blog", text: "Latest Blogs" },
			{ alt: "Travel Community", text: "Join Our Community" },
			{ alt: "Explore", text: "Ready to Explore?" },
		];

		images.forEach(({ alt }) => {
			expect(screen.getByAltText(alt)).toBeInTheDocument();
		});
	});
});
