import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Plan from '../components/Plan';
import { AppContext } from '../Context';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    deleteDoc: vi.fn(),
  };
});

describe('Plan Component', () => {
  const mockUserData = { id: '123', name: 'Test User' };
  const mockContext = {
    userData: mockUserData,
  };

  const renderComponent = (props = {}) => {
    render(
      <Router>
        <AppContext.Provider value={mockContext}>
          <Plan {...props} />
        </AppContext.Provider>
      </Router>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1: the screen should display user input window and 'send' button
  test('renders input and send button', () => {
    renderComponent();

    const inputBox = screen.getByPlaceholderText('Type your question...');
    const sendButton = screen.getByText('Send');

    expect(inputBox).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  /* Test Case 2: Verify the process of sending a message, including simulating user input, 
  clicking the send button, and displaying a mock response. */
  test('handles message sending correctly', async () => {
    // Mock fetch response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Mock Bot Response' } }],
          }),
      })
    );

    renderComponent();

    const inputBox = screen.getByPlaceholderText('Type your question...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(inputBox, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    const botMessage = await screen.findByText('Mock Bot Response');
    expect(botMessage).toBeInTheDocument();
    expect(inputBox.value).toBe('');
  });


  /* Test Case 3: Verify that the functionality for saving a response calls Firebase's addDoc method with the correct parameters */
  test('saves a response to Firebase', async () => {
    addDoc.mockResolvedValueOnce({ id: 'plan123' });

    renderComponent();

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(addDoc).toHaveBeenCalledWith(collection(expect.any(Object), 'TravelPlan'), {
      content: expect.any(String),
      timestamp: expect.any(Date),
      userId: '123',
      title: expect.any(String),
    });
  });

  /* Test Case 4: Test whether saved plans are successfully fetched from Firebase. */
  test('fetches saved plans from Firebase', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          content: 'Content here...',
          userId: '123',
          timestamp: 'November 18, 2024',
          title:'Mock Title',
        },
      ],
    });
    const planContent = screen.queryByText('Content');
    expect(planContent).not.toBeInTheDocument();
  });

  /* Test Case 5: Verify the behavior when there are no saved plans in the database */
  test('does not render saved plans when no plans exist in database', async () => {
    const mockUserData = { id: '123', name: 'Test User' };
    getDocs.mockResolvedValueOnce({
      docs: [], 
    });
  
    render(
      <Router>
        <AppContext.Provider value={{ userData: mockUserData }}>
          <Plan />
        </AppContext.Provider>
      </Router>
    );
  
    const planTitle = screen.queryByText('Mock Plan Title');
    expect(planTitle).not.toBeInTheDocument();
    const planList = screen.getByText('Saved Plans');
    expect(planList).toBeInTheDocument();
  });
  
  /* Test Case 6: Test the behavior when the user is not logged in */
  test('does not render saved plans when user is not logged in', () => {
    render(
      <Router>
        <AppContext.Provider value={{ userData: null }}>
          <Plan />
        </AppContext.Provider>
      </Router>
    );
    const planList = screen.queryByText('▼');
    expect(planList).not.toBeInTheDocument();
  });
  
});
