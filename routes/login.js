/**
 * Created by nipuna on 4/4/15.
 */
var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();


var parseUrlencoded = bodyParser.urlencoded({ extended: false });

router.route('/')
    .post(parseUrlencoded, function (request, response) {
        var email = request.body.email;
        var pass = request.body.password;
        var remember = request.body.remember;
        if (remember) {
            response.cookie('remember', 'true', {maxAge: 900000});
        }
        response.status(200).json({"sucess":true});
    });



module.exports = router;