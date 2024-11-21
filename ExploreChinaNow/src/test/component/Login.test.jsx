import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context";
import Login from "../../components/Login";
import uploadFile, {getUserData} from "../../dbOperation";
import { auth, googleProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Mock Firebase functions
vi.mock('firebase/auth', async () => {
    const original = await vi.importActual("firebase/auth");
    return {
        ...original,
        getAuth: vi.fn(),
        signInWithEmailAndPassword: vi.fn(),
        signInWithPopup: vi.fn(),
        GoogleAuthProvider: vi.fn().mockImplementation(() => ({
            setCustomParameters: vi.fn().mockReturnValue({
                prompt: "select_account",
            }),
        })),
        createUserWithEmailAndPassword: vi.fn(),
        signOut: vi.fn(),
    };
});
  
  vi.mock('../dbOperation', () => ({
    getUserData: vi.fn(),
  }));
  
  // Mock React Router's `useNavigate`
  vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom"); // Import actual for the rest of the library
    return {
      ...actual,
      useNavigate: vi.fn(), // Mock useNavigate
    };
  });

  
  describe('Login Component', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    afterAll(() => {
        vi.clearAllMocks();
      });
  
    test('should render login form and Google login button', () => {
      render(
        <MemoryRouter>
          <AppContext.Provider value={{ userData: null, setUserData: vi.fn(), loading: false, setLoading: vi.fn() }}>
            <Login />
          </AppContext.Provider>
        </MemoryRouter>
      );
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByText("Login with Google")).toBeInTheDocument();
      expect(screen.getByText("Sign In", { selector: "h2" })).toBeInTheDocument();
      expect(screen.getByText("Login", { selector: "button" })).toBeInTheDocument();
    });
  
    test('should display error message on invalid login credentials', async () => {
      global.fetch = vi.fn();
      // Mock the fetch call to simulate an error for the /auth/check-connect endpoint
      global.fetch.mockResolvedValueOnce({
      ok: true,
      });
      signInWithEmailAndPassword.mockRejectedValueOnce({
        message: 'The email address is badly formatted.',
      });
  
      render(
        <MemoryRouter>
          <AppContext.Provider value={{ userData: null, setUserData: vi.fn(), loading: false, setLoading: vi.fn() }}>
            <Login />
          </AppContext.Provider>
        </MemoryRouter>
      );
  
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText("Login"));
  
      await waitFor(() => expect(screen.getByText(/The email address is badly formatted./i)).toBeInTheDocument());
    });
  
    test('should redirect to home page after successful login', async () => {
      global.fetch = vi.fn();
      // Mock the fetch call to simulate an error for the /auth/check-connect endpoint
      global.fetch.mockResolvedValueOnce({
      ok: true,
      }).mockResolvedValueOnce({ // /auth/getUserData/${uid}
        ok: true,
        json: () => Promise.resolve({
          uid: '123',
          email: 'user@example.com',
          username: 'Test User',
        })
      });
      
      const user = { uid: '123', email: 'user@example.com', username: 'Test User' };
      signInWithEmailAndPassword.mockResolvedValueOnce({ user });
      
      // Mock navigate function
      const mockNavigate = vi.fn();
      useNavigate.mockReturnValue(mockNavigate);

      render(
        <MemoryRouter>
          <AppContext.Provider value={{ userData: null, setUserData: vi.fn(), loading: false, setLoading: vi.fn() }}>
            <Login />
          </AppContext.Provider>
        </MemoryRouter>
      );
  
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: 'user@example.com' } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText("Login"));
  
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });
  
    test('should show an error if server is unavailable during login', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Service is not available now. Please try again later.'));
  
      render(
        <MemoryRouter>
          <AppContext.Provider value={{ userData: null, setUserData: vi.fn(), loading: false, setLoading: vi.fn() }}>
            <Login />
          </AppContext.Provider>
        </MemoryRouter>
      );
  
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: 'user@example.com' } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText("Login"));
  
      await waitFor(() => expect(screen.getByText(/service is not available/i)).toBeInTheDocument());
    });
  
    test('should handle Google login successfully and redirect to homepage', async () => {
      global.fetch = vi.fn();
      // Mock the fetch call to simulate an error for the /auth/check-connect endpoint
      global.fetch.mockResolvedValueOnce({
      ok: true,
      }).mockResolvedValueOnce({ // /auth/getUserData/${uid}
        ok: true,
        json: () => Promise.resolve({
          uid: '123',
          email: 'user@example.com',
          displayName: 'Test User',
        })
      });
      
      const user = { uid: '123', displayName: 'Test User', email: 'user@example.com', photoURL: '/profile.jpg' };
      signInWithPopup.mockResolvedValueOnce({ user });

      // Mock navigate function
      const mockNavigate = vi.fn();
      useNavigate.mockReturnValue(mockNavigate);

      render(
        <MemoryRouter>
          <AppContext.Provider value={{ userData: null, setUserData: vi.fn(), loading: false, setLoading: vi.fn() }}>
            <Login />
          </AppContext.Provider>
        </MemoryRouter>
      );
      
      fireEvent.click(screen.getByText(/login with google/i));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });
  
    test('should display error message when Google login fails', async () => {
      global.fetch = vi.fn();
      // Mock the fetch call to simulate an error for the /auth/check-connect endpoint
      global.fetch.mockResolvedValueOnce({
      ok: true,
      }).mockResolvedValueOnce({ // /auth/getUserData/${uid}
        ok: true,
        json: () => Promise.resolve({
          uid: '123',
          email: 'user@example.com',
          displayName: 'Test User',
        })
      });
      signInWithPopup.mockRejectedValueOnce(new Error('Google login failed'));
  
      render(
        <MemoryRouter>
          <AppContext.Provider value={{ userData: null, setUserData: vi.fn(), loading: false, setLoading: vi.fn() }}>
            <Login />
          </AppContext.Provider>
        </MemoryRouter>
      );
  
      fireEvent.click(screen.getByText(/login with google/i));
  
      await waitFor(() => expect(screen.getByText(/google login failed/i)).toBeInTheDocument());
    });
  });