const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a Schema
const todoSchema = new Schema({
    title: {type: String, required: true},
    desc:{type: String, required: true},
    status:{type: Number, required: true, default: 0}, // 0- Pending .1- Done
    due_date: {type: Date, required: true},
    created_date: Date,
});


// Create a Model
const Todo = mongoose.model('todo', todoSchema);

// Export The Model
module.exports = Todo;
