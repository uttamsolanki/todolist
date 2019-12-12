const HttpStatus = require('http-status-codes');
const dateFormat = require('dateformat');
const User = require('../models/user');
const {signToken} = require('../helpers/auth');


module.exports = {

	signUp: async (req, res, next) => {

		const {first_name, email, password, last_name} = req.value.body;

		const findUser = await User.findOne({email: email});
		if (findUser) {
			return res.status(HttpStatus.FORBIDDEN).json({status:0,error: "Email is already in use"})
		}


		let newUser = new User();

		let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

		newUser.first_name = first_name;
		newUser.last_name = last_name;
		newUser.email = email;
		newUser.category = [];
		newUser.password = await newUser.generateHash(password);
		newUser.created_date = day;
		newUser.updated_date = day;
		await newUser.save();
		const token = await signToken(newUser);
		const data = {"user": newUser,"token":token};
		var resp = {status:1,message: "Login Successful",data:data}
		res.status(HttpStatus.OK).json(resp);

	},

	signIn: async (req, res, next) => {

		const {email, password} = req.value.body;

		let findUser = null;

		User.find({email: email}).exec(async function(error, data){
			findUser = data[0];

			if (!findUser) {
				return res.status(HttpStatus.OK).json({status:0,errors: "Please enter a valid email address"})
			}

			let isMatch =  findUser.validPassword(password);

			if (!isMatch) {
				return res.status(HttpStatus.OK).json({status:0,errors: "Please enter valid password"});

			} else {

				const token =  await  signToken(findUser);
				const data = {"user": findUser,"token":token};
				var resp = {status:1,message: "Login Successful",data:data};
				res.header('Content-type', 'application/json').status(HttpStatus.OK).json(resp);

			}
		});

	},
}
