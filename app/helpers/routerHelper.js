const Joi = require('joi');

module.exports = {
    validateBody:(schema)=>{
        return (req,res,next) =>{
            const result = Joi.validate(req.body,schema);
            if(result.error){
                console.log(result.error.details);
                return res.status(400).json(result.error);
            }
            if(!req.value){ req.value ={}; }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas:{
        authSchema :Joi.object().keys({
            first_name:Joi.string().required().label("First name"),
            last_name:Joi.string().label("Last name"),
            email:Joi.string().email().required().label("Email"),
            password:Joi.string().required(),
        }),

        signIn :Joi.object().keys({
            email:Joi.string().email().required().label("Email"),
            password:Joi.string().required(),
        }),
        todo:Joi.object().keys({
            title:Joi.string().required().label("Title"),
            description:Joi.string().required().label("Description"),
            status:Joi.number().integer().required().label("Status"),
            due_date:Joi.string().required().label("Due date"),
            c_id:Joi.string().required().label("Category id required"),
        }),
        cat:Joi.object().keys({
            title:Joi.string().required().label("Title")
        })
    }
}
