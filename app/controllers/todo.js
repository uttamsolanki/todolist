const HttpStatus = require('http-status-codes');
const dateFormat = require('dateformat');

const User = require('../models/user');
const Todo = require('../models/todo');
const Cat = require('../models/category');
const {signToken} = require('../helpers/auth');

module.exports = {

    create:async (req, res, next)=>{
        let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
        const {title, description,status,due_date,c_id} = req.body;
        var resp;
        let d=new Date(due_date);
       if(d=='Invalid Date'){
           resp = {success:false,message: "Please provide date in MM-DD-YYYY format",data:[]};
           return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(resp);
       }else{

        Cat.findById(c_id, async (error, cates) => {

            if(error){
                resp = {success:false,message: "Something Wrong",data:[]};
            }else if(cates==null){
                resp = {success:true,message: "Category not found.Please provide valid category id",data:[]};
            }else {
                let newTodo = new Todo();
                newTodo.title = title;
                newTodo.desc = description;
                newTodo.status = status;
                newTodo.created_date = day;
                newTodo.due_date = dateFormat(new Date(due_date), "yyyy-mm-dd HH:MM:ss");
                console.log(cates);
                await newTodo.save();
                cates.items.push(newTodo);
                cates.save();
                resp = {success:true,message: "New Task is Created",data:newTodo};
            }
            return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(resp);
        });
       }

    },
    get:async (req, res, next)=>{
        let option ={};
        if(req.params.id){
            option={_id:req.params.id};
        }

        Todo.find(option).exec(function (err, todos){
            let respData =[];
            var resp;
            if(!err){
                resp = {success:true,message: 'All todo list',data:todos};
            }else{
                resp = {success:false,message: 'Something Wrong',data:todos};
            }
            res.json(resp);
        });
    },
    getAll:async (req, res, next)=>{
        console.log(req.query)
        var temp={};
        if(req.query.sort!==undefined && req.query.sort!==null){
            if(req.query.sort=='desc'){
                temp={status: -1}
            }else{
                temp={status: 1}
            }

        }

        User.find({_id:req.user.sub}).populate({ path: 'category',populate:{path:'items',options: {sort: temp}}}).exec(function (err, todos){
            var resp;
            if(!err){
                resp = {success:true,message: 'All todo list',data:todos};
            }else{
                resp = {success:false,message: 'Something Wrong',data:todos};
            }
            //var ;
            res.json(resp);
        });
    },

    update:async (req, res, next)=>{

        let updateData=req.body;
        var rep;
        Todo.findById(req.params.id, function (err, todo) {

            if(err){
                rep = {success:false,message: "Something Wrong",data:[]};
            } else if(todo==null){
                rep = {success:true,message: 'Category not found',data:[]};
            }else{
                for (let i in updateData) {
                    todo[i] = updateData[i];
                }
                todo.save();
                rep = {success:true,message: 'Task is Updated',data:todo};
            }

            return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(rep);
        });
    },
    delete:async (req, res, next)=>{
        var rep;
        Todo.findByIdAndRemove(req.params.id,{$set:req.body},  function(err, todos){

            if(err){
                rep = {success:false,message: "Something Wrong",data:[]};
            }else if(cates==null){
                rep = {success:true,message: 'Task not found',data:[]};
            }else {
                rep = {success:true, message: 'Task is Deleted', data: cates};
            }
            return res.header('Content-type', 'application/json').status(HttpStatus.OK).json(rep);
        });
    }

}
