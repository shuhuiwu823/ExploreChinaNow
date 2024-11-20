import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddPost from "../../components/AddPost";
import { AppContext } from "../../Context";
import { addBlogPostToFirestore } from "../../services/firestoreService";
import { MemoryRouter } from "react-router-dom";

// Mock Firestore service
vi.mock("../../services/firestoreService", () => ({
  addBlogPostToFirestore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AddPost Component", () => {
  const mockOnPostAdded = vi.fn();
  const mockUserData = { username: "testUser" };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders form elements correctly", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <AddPost onPostAdded={mockOnPostAdded} />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Verify form inputs are present
    expect(screen.getByText("Title:")).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUserData.username)).toBeInTheDocument();
    expect(screen.getByText("Content:")).toBeInTheDocument();
    expect(screen.getByText("Upload Images (up to 9):")).toBeInTheDocument();
    expect(screen.getByText("Submit Post")).toBeInTheDocument();
  });

  test("displays character counter for content", async () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <AddPost />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Get the content input field
    const textarea = screen.getByLabelText("Content:");

    // Simulate typing text
    fireEvent.change(textarea, { target: { value: "Testing content" } });

    // Verify the character counter updates correctly
    expect(screen.getByText("15/1000 characters")).toBeInTheDocument();
  });

  test("calls Firestore service and navigates on successful submission", async () => {
    vi.mocked(addBlogPostToFirestore).mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <AddPost onPostAdded={mockOnPostAdded} />
        </AppContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByText("Title:").nextSibling, {
      target: { value: "Test Blog" },
    });
    fireEvent.change(screen.getByText("Content:").nextSibling, {
      target: { value: "This is a test blog content." },
    });

    fireEvent.click(screen.getByText("Submit Post"));

    await waitFor(() => {
      expect(addBlogPostToFirestore).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Blog",
          content: "This is a test blog content.",
          author: mockUserData.username,
        }),
        []
      );
      expect(mockOnPostAdded).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/blogs", { replace: true });
    });
  });

  test("shows alert on failure to submit", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(addBlogPostToFirestore).mockRejectedValueOnce(new Error("Failed"));

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <AddPost />
        </AppContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByText("Title:").nextSibling, {
      target: { value: "Test Blog" },
    });
    fireEvent.change(screen.getByText("Content:").nextSibling, {
      target: { value: "This is a test blog content." },
    });

    fireEvent.click(screen.getByText("Submit Post"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Failed to add the post, please try again later"
      );
    });
  });

  it("limits uploaded images to a maximum of 9", () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // Mock user data
    const mockUserData = { username: "testUser" };

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <AddPost />
        </AppContext.Provider>
      </MemoryRouter>
    );

    const fileInput = screen.getByLabelText(/Upload Images/i);

    // Simulate uploading more than 9 images
    const files = Array(10).fill(new File(["dummy"], "image.jpg", { type: "image/jpeg" }));
    fireEvent.change(fileInput, { target: { files } });

    // Verify alert is called
    expect(alertMock).toHaveBeenCalledWith("You can upload up to 9 images");

    // Restore the mocked alert
    alertMock.mockRestore();
  });
});
