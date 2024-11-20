import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import MapContainer from "../../components/MapContainer";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("MapContainer Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders map and buttons correctly", () => {
    render(
      <MemoryRouter>
        <MapContainer />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /show all markers/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show popular cities/i })
    ).toBeInTheDocument();
  });

  test("toggles marker display correctly", () => {
    render(
      <MemoryRouter>
        <MapContainer />
      </MemoryRouter>
    );

    const allMarkersButton = screen.getByRole("button", {
      name: /show all markers/i,
    });
    fireEvent.click(allMarkersButton);
    expect(screen.getByText("Beijing")).toBeInTheDocument();

    const popularMarkersButton = screen.getByRole("button", {
      name: /show popular cities/i,
    });
    fireEvent.click(popularMarkersButton);
    expect(screen.getByText("Shanghai")).toBeInTheDocument();
  });

  test("opens modal on marker click", async () => {
    render(
      <MemoryRouter>
        <MapContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Beijing"));

    await waitFor(() =>
      expect(screen.getByText(/city information: Beijing/i)).toBeInTheDocument()
    );
  });

  test("closes modal on close button click", async () => {
    render(
      <MemoryRouter>
        <MapContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Beijing"));

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() =>
      expect(
        screen.queryByText(/city information: Beijing/i)
      ).not.toBeInTheDocument()
    );
  });

  test("navigates to travel video page", async () => {
    render(
      <MemoryRouter>
        <MapContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Beijing"));
    fireEvent.click(screen.getByRole("button", { name: /find travel video/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/videos", {
        state: { selectedCity: "Beijing" },
      });
    });
  });

  test("displays sidebar for popular city Chongqing", async () => {
    render(
      <MemoryRouter>
        <MapContainer />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /show popular cities/i })
    );
    fireEvent.click(screen.getByText("Chongqing"));

    await waitFor(() =>
      expect(screen.getByText(/chongqing \(重庆市\)/i)).toBeInTheDocument()
    );
  });
});
