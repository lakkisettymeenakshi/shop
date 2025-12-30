const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: String, default: false },
  // ADD THIS LINE:
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', TaskSchema);