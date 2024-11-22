import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context";
import Register from "../../components/Register";
import uploadFile from "../../dbOperation";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Mock Firebase methods and dependencies
vi.mock("firebase/auth", async () => {
    const original = await vi.importActual("firebase/auth");
    return {
      ...original,
      getAuth: vi.fn(),
      createUserWithEmailAndPassword: vi.fn(),
    };
  });
  
vi.mock("firebase/firestore", async () => {
    const original = await vi.importActual("firebase/firestore");
    return {
      ...original,
      getFirestore: vi.fn(),
      setDoc: vi.fn(),
      doc: vi.fn(),
    };
  });
vi.mock("../../dbOperation", () => ({
  default: vi.fn(), // Mock the default export (uploadFile)
  getUserData: vi.fn(), // Optional, if you need to mock named exports
  loginService: vi.fn(), // Optional, if you need to mock named exports
}));

// Mock navigation hook
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom"); // Import actual for the rest of the library
    return {
      ...actual,
      useNavigate: vi.fn(), // Mock useNavigate
    };
  });

describe("Register Component", () => {
  const mockSetUserData = vi.fn();
  const mockSetLoading = vi.fn();
  global.fetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  test("renders the registration form", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            userData: null,
            setUserData: mockSetUserData,
            loading: false,
            setLoading: mockSetLoading,
          }}
        >
          <Register />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Check for form fields
    expect(screen.getByText("Sign Up", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByText("Sign Up", { selector: "button" })).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  test("displays an error message if required fields are missing", async () => {
  // Mock the fetch call to simulate an error for the /auth/check-connect endpoint
  global.fetch.mockResolvedValueOnce({
    ok: true,
    });

  // Mock createUserWithEmailAndPassword to simulate Firebase invalid email error
  vi.mock('firebase/auth', async () => {
    const original = await vi.importActual('firebase/auth');
    return {
      ...original,
      createUserWithEmailAndPassword: vi.fn().mockRejectedValue({
        code: 'auth/invalid-email',
        message: 'The email address is badly formatted.',
      }),
    };
  });

  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          userData: null,
          setUserData: mockSetUserData,
          loading: false,
          setLoading: mockSetLoading,
        }}
      >
        <Register />
      </AppContext.Provider>
    </MemoryRouter>
  );

  // Fill out the form with valid data
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "testuser" },
  });
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: "invalid-email" }, // Invalid email to trigger Firebase error
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Test User" },
  });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

  // Wait for async operations
  await waitFor(() => expect(mockSetUserData).not.toHaveBeenCalled());
  await waitFor(() => expect(mockSetLoading).toHaveBeenCalled());

  // Check if the error message for The email address is badly formatted is displayed
  expect(screen.getByText(/The email address is badly formatted/i)).toBeInTheDocument();
  });

  test("calls Firebase and navigates on successful registration", async () => {
    // Mock the fetch call to simulate an error for the /auth/check-connect endpoint
    global.fetch.mockResolvedValueOnce({
        ok: true,
    });
    global.URL.createObjectURL = vi.fn().mockReturnValue('mocked-url');

    // Create a mock file
    const file = new File(['dummy content'], '/uploaded-avatar.png', { type: 'image/png' });
    // Mock Firebase and uploadFile
    const mockUploadFile = uploadFile.mockResolvedValue("/uploaded-avatar.png");
    const mockCreateUser = createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "test-user-id" } });

    // Mock navigate function
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            userData: null,
            setUserData: mockSetUserData,
            loading: false,
            setLoading: mockSetLoading,
          }}
        >
          <Register />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Upload an Image"), {
      target: { files: [file] },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Wait for async operations
    await waitFor(() => expect(mockCreateUser).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    await waitFor(() => expect(global.URL.createObjectURL).toHaveBeenCalledWith(file));

    // Verify user data was set
    expect(mockSetUserData).toHaveBeenCalledWith({
      id: "test-user-id",
      username: "testuser",
      email: "test@example.com",
      avatar: "/uploaded-avatar.png",
      name: "Test User",
    });

    expect(mockUploadFile).toHaveBeenCalled();
  });
});
