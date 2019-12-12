const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a Schema
const categorySchema = new Schema({
    title: {type: String, required: true},
    items:[{ type: Schema.Types.ObjectId, ref: 'todo' }],
    created_date: Date,
});


// Create a Model
const Category = mongoose.model('category', categorySchema);

// Export The Model
module.exports = Category
