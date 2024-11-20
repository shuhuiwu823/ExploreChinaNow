import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import Profile from "../../components/Profile";
import { AppContext } from "../../Context";
import {
  getBlogPostsFromFirestore,
  deleteBlogPostFromFirestore,
} from "../../services/firestoreService";

// Mock Firestore service
vi.mock("../../services/firestoreService", () => ({
  getBlogPostsFromFirestore: vi.fn(),
  deleteBlogPostFromFirestore: vi.fn(),
}));

describe("Profile Component - Blogs Section", () => {
  const mockUserData = {
    username: "testUser",
    avatar: "https://example.com/avatar.png",
    email: "test@example.com",
    name: "Test User",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockBlogs = [
    {
      id: "1",
      title: "First Blog",
      author: "testUser",
      content: "This is the content of the first blog.",
      images: ["https://firebasestorage.googleapis.com/v0/b/mockimage1.jpg"],
    },
    {
      id: "2",
      title: "Second Blog",
      author: "testUser",
      content: "This is the content of the second blog.",
      images: [],
    },
  ];

  test("renders user's blogs correctly", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockBlogs);
  
    render(
      <AppContext.Provider value={{ userData: mockUserData }}>
        <Profile />
      </AppContext.Provider>
    );
  
    // Wait for blogs to load
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
      expect(screen.getByText("Second Blog")).toBeInTheDocument();
    });
  
    // Verify content is initially collapsed (partial match for content snippet)
    expect(
      screen.getByText((content) =>
        content.startsWith("This is the content of the first blog")
      )
    ).toBeInTheDocument();
  });
  
  test("expands and collapses blog content", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockBlogs);
  
    render(
      <AppContext.Provider value={{ userData: mockUserData }}>
        <Profile />
      </AppContext.Provider>
    );
  
    // Wait for blogs to load
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
    });
  
    // Locate the first blog post by its title
    const firstBlog = screen.getByText("First Blog").closest(".profile-blog-post");
    expect(firstBlog).toBeInTheDocument();
  
    // Find the "Expand" button inside the first blog post
    const expandButton = within(firstBlog).getByText("Expand");
    fireEvent.click(expandButton);
  
    // Verify content is expanded
    expect(within(firstBlog).getByText("Collapse")).toBeInTheDocument();
    expect(
      within(firstBlog).getByText("This is the content of the first blog.")
    ).toBeInTheDocument();
  
    // Collapse the content
    const collapseButton = within(firstBlog).getByText("Collapse");
    fireEvent.click(collapseButton);
  
    // Verify content is collapsed again
    expect(within(firstBlog).getByText("Expand")).toBeInTheDocument();
    expect(
      within(firstBlog).queryByText("This is the content of the first blog.")
    ).not.toBeInTheDocument();
  });
  

  test("deletes a blog post", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockBlogs);
    vi.mocked(deleteBlogPostFromFirestore).mockResolvedValueOnce();

    render(
      <AppContext.Provider value={{ userData: mockUserData }}>
        <Profile />
      </AppContext.Provider>
    );

    // Wait for blogs to load
    await waitFor(() => {
      expect(screen.getByText("First Blog")).toBeInTheDocument();
    });

    // Simulate delete action
    const deleteButton = screen.getAllByText("Delete")[0];
    window.confirm = vi.fn(() => true); // Mock confirmation dialog
    fireEvent.click(deleteButton);

    // Verify Firestore service is called
    await waitFor(() => {
      expect(deleteBlogPostFromFirestore).toHaveBeenCalledWith("1");
    });

    // Verify blog is removed from UI
    expect(screen.queryByText("First Blog")).not.toBeInTheDocument();
  });

  test("shows message when no blogs are available", async () => {
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce([]);

    render(
      <AppContext.Provider value={{ userData: mockUserData }}>
        <Profile />
      </AppContext.Provider>
    );

    // Wait for blogs to load
    await waitFor(() => {
      expect(screen.getByText("You have not published any blog posts yet.")).toBeInTheDocument();
    });
  });
});
