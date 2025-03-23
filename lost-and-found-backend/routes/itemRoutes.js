const express = require('express');
const Item = require('../models/item');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add a new item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      found: req.body.found,
      category: req.body.category,
      reportedById: req.userId,
      reportedByUsername: user.username,
      reportedByEmail: user.email
    });
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an item by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the authenticated user is the reporter
    if (item.reportedById.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all items, with optional search query for name, description, and category
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = {};
    console.log('Received Querey Parameters: ', req.query);
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
      if (req.query.category === 'MyItems') {
        query.reportedByUsername = req.query.reportedByUsername;
      }
      else query.category = req.query.category;
    }

    
    console.log('Query: ', query);

    const items = await Item.find(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an item by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the authenticated user is the reporter
    if (item.reportedById.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
