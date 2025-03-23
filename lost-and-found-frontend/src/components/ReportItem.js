import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function ReportItem() {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    found: false,
    category: 'Electronics',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/items', newItem);
      setNewItem({ name: '', description: '', found: false, category: 'Electronics' });
    } catch (error) {
      console.error('Error submitting item', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Report New Item</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={newItem.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            required
          >
            <option value="Electronics">Electronics</option>
            <option value="Stationery">Stationery</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Item Description"
            value={newItem.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            Found:
            <input
              type="checkbox"
              name="found"
              checked={newItem.found}
              onChange={() => setNewItem({ ...newItem, found: !newItem.found })}
            />
          </label>
        </div>
        <button type="submit">Report Item</button>
      </form>
    </div>
  );
}

export default ReportItem;