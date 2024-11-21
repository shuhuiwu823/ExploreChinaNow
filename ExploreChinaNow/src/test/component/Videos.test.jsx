import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import VideosPage from "../../components/Videos";

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useLocation: vi.fn(),
	};
});

describe("VideosPage Component", () => {
	beforeEach(() => {
		vi.mocked(useLocation).mockReturnValue({
			state: { selectedCity: "Beijing" },
		});
	});

	it("renders the main title and search bar", () => {
		render(
			<MemoryRouter>
				<VideosPage />
			</MemoryRouter>
		);

		expect(screen.getByText("Explore The Best Travel Videos")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter keywords...")).toBeInTheDocument();
		expect(screen.getByText("Search")).toBeInTheDocument();
	});

	it("handles search input changes", () => {
		render(
			<MemoryRouter>
				<VideosPage />
			</MemoryRouter>
		);

		const input = screen.getByPlaceholderText("Enter keywords...");
		fireEvent.change(input, { target: { value: "Shanghai" } });

		expect(input.value).toBe("Shanghai");
	});

	it("triggers handleCitySearch when clicking on popular search links", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ items: [] }),
			})
		);

		render(
			<MemoryRouter>
				<VideosPage />
			</MemoryRouter>
		);

		const beijingLink = screen.getByText("Beijing");
		fireEvent.click(beijingLink);

		expect(screen.getByPlaceholderText("Enter keywords...").value).toBe("Beijing travel vlog");
		await waitFor(() => expect(global.fetch).toHaveBeenCalled());
	});

	it("displays loading message while fetching videos", async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ items: [] }),
			})
		);

		render(
			<MemoryRouter>
				<VideosPage />
			</MemoryRouter>
		);

		const searchButton = screen.getByText("Search");
		fireEvent.click(searchButton);

		expect(screen.getByText("Loading...")).toBeInTheDocument();

		await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
	});
});
