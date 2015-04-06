/**
 * Created by nipuna on 4/4/15.
 */
var express = require('express');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(logger('combined'));


var login = require("./routes/login");
app.use('/login', login);

var api = require("./routes/api");
app.use('/api', api);

var status = require("./routes/views");
app.use('/views', status);

app.listen(3000);