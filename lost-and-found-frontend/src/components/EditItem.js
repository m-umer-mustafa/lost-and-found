// EditItem.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function EditItem({ item, onClose, onUpdate }) {
  const [editedItem, setEditedItem] = useState(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/items/${editedItem._id}`, editedItem);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating item', error);
    }
  };

  return (
    <div className="item-list">
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={editedItem.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={editedItem.category}
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
            value={editedItem.description}
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
              checked={editedItem.found}
              onChange={() => setEditedItem({ ...editedItem, found: !editedItem.found })}
            />
          </label>
        </div>
        <button type="update">Update Item</button>
        <button type="update" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default EditItem;