import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('App Component', () => {
  test('renders login page', () => {
    render(<App />);
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('handles login', async () => {
    // Mock login response
    axios.post.mockResolvedValue({
      data: {
        token: 'test-token',
        user: { _id: 'test-user-id', username: 'testuser', email: 'test@example.com' }
      }
    });

    render(<App />);
    const loginEmail = screen.getByPlaceholderText('someone@example.com');
    const loginPassword = screen.getByPlaceholderText('password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(loginEmail, { target: { value: 'test@example.com' } });
    fireEvent.change(loginPassword, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    // Check for welcome message after login
    expect(screen.getByText(/WELCOME, testuser/i)).toBeInTheDocument();
  });

  test('handles item reporting', async () => {
    // Mock authentication
    axios.post.mockResolvedValue({
      data: {
        token: 'test-token',
        user: { _id: 'test-user-id', username: 'testuser', email: 'test@example.com' }
      }
    });

    // Mock item creation
    axios.post.mockResolvedValue({
      data: { name: 'Test Item', category: 'Electronics' }
    });

    render(<App />);
    const loginEmail = screen.getByPlaceholderText('someone@example.com');
    const loginPassword = screen.getByPlaceholderText('password');
    const loginButton = screen.getByText('Login');
    const goToReportPageButton = screen.getByText('Report Item');

    // Login
    fireEvent.change(loginEmail, { target: { value: 'test@example.com' } });
    fireEvent.change(loginPassword, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    // Go to report page
    fireEvent.click(goToReportPageButton);

    // Fill item form
    const itemName = screen.getByPlaceholderText('Item Name');
    const itemCategory = screen.getByDisplayValue('Electronics');
    const reportButton = screen.getByText('Report Item');

    fireEvent.change(itemName, { target: { value: 'Test Item' } });
    fireEvent.click(reportButton);

    // Check for success message
    expect(screen.getByText(/Your claim request has been sent successfully/i)).toBeInTheDocument();
  });
});