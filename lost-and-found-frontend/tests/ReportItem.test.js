import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ReportItem from '../components/ReportItem';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('ReportItem Component', () => {
  test('renders correctly', () => {
    render(<ReportItem />);
    const heading = screen.getByText(/Report New Item/i);
    expect(heading).toBeInTheDocument();
  });

  test('submits item correctly', async () => {
    // Mock API response
    axios.post.mockResolvedValue({
      data: { name: 'Test Item', category: 'Electronics' }
    });

    render(<ReportItem />);
    const itemName = screen.getByPlaceholderText('Item Name');
    const itemCategory = screen.getByDisplayValue('Electronics');
    const reportButton = screen.getByText('Report Item');

    fireEvent.change(itemName, { target: { value: 'Test Item' } });
    fireEvent.click(reportButton);

    // Check for success message
    expect(screen.getByText(/Your claim request has been sent successfully/i)).toBeInTheDocument();
  });
});