import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Login Component', () => {
  test('renders correctly', () => {
    render(<Login onLogin={() => {}} />);
    const heading = screen.getByText(/Sign in with email/i);
    expect(heading).toBeInTheDocument();
  });

  test('handles login', async () => {
    // Mock login response
    axios.post.mockResolvedValue({
      data: {
        token: 'test-token',
        user: { _id: 'test-user-id', username: 'testuser', email: 'test@example.com' }
      }
    });

    const onLogin = jest.fn();
    render(<Login onLogin={onLogin} />);
    const email = screen.getByPlaceholderText('someone@example.com');
    const password = screen.getByPlaceholderText('password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(email, { target: { value: 'test@example.com' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    // Check if login callback was called
    expect(onLogin).toHaveBeenCalled();
  });
});