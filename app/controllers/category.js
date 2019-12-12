const HttpStatus = require('http-status-codes');
const dateFormat = require('dateformat');

const User = require('../models/user');
const Category = require('../models/category');
const {signToken} = require('../helpers/auth');

module.exports = {

    create:async (req, res, next)=>{
        let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
        const {title} = req.body;

         User.findById(req.user.sub,  async (error, user) => {
             let newCat = new Category();
             newCat.title = title;
             newCat.created_date = day;
             await newCat.save();
             user.category.push(newCat);
             user.save(function (err, updatedUser) {
                 var rep = {success:true,message: 'New Category Created',data:newCat};
                 return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(rep);
             });
        });
    },
    get:async (req, res, next)=>{
        let option ={};
        if(req.params.id){
            option={_id:req.params.id};
        }

        Category.find(option).exec(function (err, cates){
            var resp;
            if(!err){
                resp = {success:true,message: "Category List",data:cates};
            }else{
                resp = {success:false,message: "Something Wrong",data:[]};
            }
            res.json(resp);
        });
    },
    getAll:async (req, res, next)=>{
        let option ={};
        var rep;
        if(req.params.id){
            option={_id:req.params.id};
        }

        User.find({_id:req.user.sub}).populate('category').exec(function (err, cates){
            if(!err){
                rep = {success:true,message: 'All Categories',data:cates[0].category};
            }else{
                rep = {success:false,message: "Something Wrong",data:[]};
            }

            return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(rep);
        });
    },
    update:async (req, res, next)=>{

        let updateData=req.body;
        var rep;
        Category.findById(req.params.id, function (err, cates) {
            if(err){
                rep = {success:false,message: "Something Wrong",data:[]};
            } else if(cates==null){
                rep = {success:true,message: 'Category not found',data:[]};
            }else{
                for (let i in updateData) {
                    cates[i] = updateData[i];
                }
                cates.save(function (err, updatedUser) {
                    rep = {success:true,message: 'Category Updated',data:cates};
                });
            }

            return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(rep);
        });

    },
    delete:async (req, res, next)=>{
        var rep;
        Category.findByIdAndRemove(req.params.id,{$set:req.body},  function(err, cates){

            if(err){
                rep = {success:false,message: "Something Wrong",data:[]};
            }else if(cates==null){
                rep = {success:true,message: 'Category not found',data:[]};
            }else {
                rep = {success:true, message: 'Category Deleted', data: cates};
            }
            return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(rep);
        });
    }

}
