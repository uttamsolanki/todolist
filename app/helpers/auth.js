const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/constants');
const HttpStatus = require('http-status-codes')
const User = require('../models/user');
module.exports = {

    signToken: async (user) => {
        return JWT.sign({
            iss: 'TodoList',
            sub: user._id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1)
        }, JWT_SECRET);
    },

    auth: async (req, res, next) => {
        const token = req.header('authorization');
        if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({message: "Unauthorized user"})
        try {
            const decode = JWT.verify(token, JWT_SECRET);
            req.user = decode;
            var findUser;
             User.findById(req.user.sub, (error, data) => {
              //   console.log(data)
                findUser = data;
                if (!findUser) {
                    return res.status(HttpStatus.BAD_REQUEST).json({status:0,errors: "Bad Request"})
                }
                next();
            });
        } catch (ex) {
            res.status(HttpStatus.BAD_REQUEST).json({message: "Bad Request"})
        }

    },

}
