import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Blogs from "../../components/Blogs";
import { AppContext } from "../../Context";
import { MemoryRouter } from "react-router-dom";
import { getBlogPostsFromFirestore } from "../../services/firestoreService";

// Mock Firestore service
vi.mock("../../services/firestoreService", () => ({
  getBlogPostsFromFirestore: vi.fn(),
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

describe("Blogs Component", () => {
  const mockUserData = { username: "testUser" };

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockPosts = [
    {
      id: "1",
      title: "First Blog",
      author: "Author 1",
      content: "This is the first blog content.",
      images: [],
    },
    {
      id: "2",
      title: "Second Blog",
      author: "Author 2",
      content: "This is the second blog content.",
      images: [],
    },
  ];

  test("renders blog posts correctly", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockPosts);

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <Blogs />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
      expect(screen.getByText("Second Blog")).toBeInTheDocument();
    });

    // Verify other elements
    expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search by title, author, or content")).toBeInTheDocument();
    expect(screen.getByText("Add Post")).toBeInTheDocument();
  });

  test("navigates to AddPost when 'Add Post' is clicked", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <Blogs />
        </AppContext.Provider>
      </MemoryRouter>
    );
  
    const addPostButton = screen.getByText("Add Post");
    fireEvent.click(addPostButton);
  
    // Verify the addPost page is rendered
    expect(screen.getByText("Add New Post")).toBeInTheDocument();
  });
  

  test("filters blog posts by search query", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockPosts);

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <Blogs />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText("Search by title, author, or content");
    fireEvent.change(searchInput, { target: { value: "First" } });
    fireEvent.click(screen.getByText("Search"));

    // Verify filtered result
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
      expect(screen.queryByText("Second Blog")).not.toBeInTheDocument();
    });
  });

  test("clears search and resets blog posts", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockPosts);

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <Blogs />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText("Search by title, author, or content");
    fireEvent.change(searchInput, { target: { value: "First" } });
    fireEvent.click(screen.getByText("Search"));

    // Verify filtered result
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
      expect(screen.queryByText("Second Blog")).not.toBeInTheDocument();
    });

    // Clear search
    fireEvent.click(screen.getByText("Clear"));

    // Verify all posts are displayed again
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
      expect(screen.getByText("Second Blog")).toBeInTheDocument();
    });
  });

  test("paginates blog posts correctly", async () => {
    // Generate 10 mock posts for pagination
    const paginatedPosts = Array.from({ length: 10 }, (_, index) => ({
      id: `${index + 1}`,
      title: `Blog ${index + 1}`,
      author: `Author ${index + 1}`,
      content: `Content of blog ${index + 1}`,
      images: [],
    }));
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(paginatedPosts);

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <Blogs />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("Blog 1")).toBeInTheDocument();
      expect(screen.getByText("Blog 5")).toBeInTheDocument();
      expect(screen.queryByText("Blog 6")).not.toBeInTheDocument();
    });

    // Navigate to the next page
    fireEvent.click(screen.getByText("Next"));

    // Verify posts on the second page
    await waitFor(() => {
      expect(screen.getByText("Blog 6")).toBeInTheDocument();
      expect(screen.getByText("Blog 10")).toBeInTheDocument();
      expect(screen.queryByText("Blog 1")).not.toBeInTheDocument();
    });
  });
});
