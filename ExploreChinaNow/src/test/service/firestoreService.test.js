import { vi } from "vitest";
import { getBlogPostsFromFirestore } from "../../services/firestoreService";

// Mock Firestore service
vi.mock("../../services/firestoreService", () => ({
  getBlogPostsFromFirestore: vi.fn(),
}));

describe("Firestore Service", () => {
  it("fetches blog posts correctly", async () => {
    const mockData = [
      { id: "1", title: "Test Blog 1", author: "Author 1", content: "Content 1" },
    ];

    // use vi.mocked to set return value
    vi.mocked(getBlogPostsFromFirestore).mockResolvedValueOnce(mockData);

    const data = await getBlogPostsFromFirestore();
    expect(data).toEqual(mockData);
  });
});
