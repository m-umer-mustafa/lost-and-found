const express = require('express');
const Item = require('../models/item');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const Notification = require('../models/notification');

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
    console.log("Info of update request: ", req.params);
    console.log("Updating item with ID(in itemRoutes): ", req.params.itemName);
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

// Add a claim to an item
router.post('/:id/claim', authMiddleware, async (req, res) => {
  try {
    console.log("Claiming item with ID(in itemRoutes): ", req.params.id);
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the item is already claimed
    if (item.claimedById) {
      return res.status(400).json({ message: 'This item is already claimed' });
    }

    // Check if the current user is trying to claim their own item
    if (item.reportedById.toString() === req.userId) {
      return res.status(403).json({ message: 'You cannot claim your own item' });
    }

    item.claimedById = req.userId;
    item.claimStatus = 'pending';
    await item.save();

    // Create notification for the item reporter
    const notification = new Notification({
      userId: item.reportedById,
      itemId: item._id,
      message: `Someone has claimed item: ${item.name}`
    });
    await notification.save();

    // Add notification to user's notifications
    const user = await User.findById(item.reportedById);
    user.notifications.push(notification._id);
    await user.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manage claim status (accept/reject)
router.put('/:id/claim', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the authenticated user is the reporter
    if (item.reportedById.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to manage this claim' });
    }

    // Update claim status
    item.claimStatus = req.body.claimStatus;
    await item.save();

    // Create notification for the claimant
    const claimant = await User.findById(item.claimedById);
    const notification = new Notification({
      userId: item.claimedById,
      itemId: item._id,
      message: `Your claim for ${item.name} has been ${req.body.claimStatus}`
    });
    await notification.save();

    claimant.notifications.push(notification._id);
    await claimant.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
