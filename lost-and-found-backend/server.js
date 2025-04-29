const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lostandfound', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB: ", err));

// Routes
app.use('/api/items', authMiddleware, itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});