import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AppContext } from "../../Context";
import Header from "../../components/Header";

describe("Header Component", () => {
	it("renders the header with navigation links", () => {
		render(
			<MemoryRouter>
				<AppContext.Provider value={{ loading: false, userData: null }}>
					<Header />
				</AppContext.Provider>
			</MemoryRouter>
		);

		expect(screen.getByText("ExploreChinaNow")).toBeInTheDocument();
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Videos")).toBeInTheDocument();
		expect(screen.getByText("Map")).toBeInTheDocument();
		expect(screen.getByText("Tour Plan")).toBeInTheDocument();
	});

	it("renders user-specific links when user is logged in", () => {
		const userData = { avatar: "/avatar.png", username: "John Doe" };
		render(
			<MemoryRouter>
				<AppContext.Provider value={{ loading: false, userData }}>
					<Header />
				</AppContext.Provider>
			</MemoryRouter>
		);

		expect(screen.getByAltText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Logout")).toBeInTheDocument();
	});
});
