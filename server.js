const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Models and Middleware
const Task = require('./models/Task');
const authMiddleware = require('./middleware/auth'); // THE SECURITY GUARD
const authRoutes = require('./routes/auth'); // THE SIGNUP/LOGIN LOGIC

const app = express();
const port = process.env.PORT || 5000;
const dbLink = process.env.MONGO_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Use Auth Routes (Signup/Login)
app.use('/api/auth', authRoutes);

//  Task Routes get only the tasks for the logged-in user
app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new task linked  logged-in user
app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const newTask = new Task({
      name: req.body.name,
      user: req.user // ID comes from the JWT token
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCHtask
app.patch('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('My server is Running');
});

// MongoDB and Start Server
mongoose.connect(dbLink)
  .then(() => {
    console.log(' Connected to MongoDB');
    app.listen(port, () => {
      console.log(` Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });