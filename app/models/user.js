const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a Schema
const userSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String},
	email: {type: String, required: true, unique: true, lowercase: true},
	password: {type: String, required: true},
	created_date: Date,
	updated_date: Date,
	category:[{ type: Schema.Types.ObjectId, ref: 'category' }],
});

//Generate Hash
userSchema.methods.generateHash = async function (password) {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (error) {

	}
};

//validate Password
userSchema.methods.validPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw new Error(error);
	}
};
// Create a Model
const User = mongoose.model('user', userSchema);

// Export The Model
module.exports = User
