import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EditItem from '../components/EditItem';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('EditItem Component', () => {
  test('renders correctly', () => {
    const item = {
      name: 'Test Item',
      description: 'This is a test item',
      category: 'Electronics',
      found: false
    };

    render(<EditItem item={item} onClose={() => {}} onUpdate={() => {}} />);
    const heading = screen.getByText(/Edit Item/i);
    expect(heading).toBeInTheDocument();
  });

  test('updates item correctly', async () => {
    const item = {
      _id: 'test-item-id',
      name: 'Test Item',
      description: 'This is a test item',
      category: 'Electronics',
      found: false
    };

    // Mock API response
    axios.put.mockResolvedValue({
      data: { name: 'Updated Item', category: 'Electronics' }
    });

    render(<EditItem item={item} onClose={() => {}} onUpdate={() => {}} />);
    const itemName = screen.getByDisplayValue('Test Item');
    const updateButton = screen.getByText('Update Item');

    fireEvent.change(itemName, { target: { value: 'Updated Item' } });
    fireEvent.click(updateButton);

    // Check for updated item
    expect(screen.getByDisplayValue('Updated Item')).toBeInTheDocument();
  });
});