var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
//var HttpStatus = require('http-status-codes');
var cors = require('cors')

var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');


var port = process.env.PORT || 8042;

var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url, {useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true,useFindAndModify:false});

app.use(cors({origin:'*'}));
//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//routes
app.use('/users', require('./routes/user'));
app.use('/list', require('./routes/todo'));
app.use('/cat', require('./routes/category'));
//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');



//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({message: "Request not found"});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});
exports = module.exports = app;
