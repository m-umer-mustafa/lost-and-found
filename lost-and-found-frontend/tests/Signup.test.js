import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Signup from '../components/Signup';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Signup Component', () => {
  test('renders correctly', () => {
    render(<Signup onSignup={() => {}} />);
    const heading = screen.getByText(/Sign Up/i);
    expect(heading).toBeInTheDocument();
  });

  test('handles signup', async () => {
    // Mock signup response
    axios.post.mockResolvedValue({
      data: {
        token: 'test-token',
        user: { _id: 'test-user-id', username: 'testuser', email: 'test@example.com' }
      }
    });

    const onSignup = jest.fn();
    render(<Signup onSignup={onSignup} />);
    const username = screen.getByPlaceholderText('username');
    const email = screen.getByPlaceholderText('someone@example.com');
    const password = screen.getByPlaceholderText('password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(username, { target: { value: 'testuser' } });
    fireEvent.change(email, { target: { value: 'test@example.com' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(signupButton);

    // Check if signup callback was called
    expect(onSignup).toHaveBeenCalled();
  });
});