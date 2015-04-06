/**
 * Created by nipuna on 4/4/15.
 */
var express = require('express');
var uuid = require('node-uuid');
var mysql  = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');

var router = express.Router();
var parseUrlencoded = bodyParser.urlencoded({ extended: false });



var tokens = {};
var dbconfigs = {
    "server" : "",
    "user":"",
    "password":"",
    "port":"",
    "database":""
};

var logwrite = function(log){
    fs.appendFile('./logs/Output.txt', log + "\n",function (err) {
        if (err) throw err;
    });
};

router.param('*',function(request,response,next){
    if (request.accepts('application/json') == true) {
        next();
    }else{
        response.status(502).json({"status": {"502":"Error in the Content-Type"}});
    }
});
router.route('/auth')
    .post(parseUrlencoded, function (request, response) {
        var username = request.body.username;
        var password = request.body.password;
        if (authenticationCheck(username, password)){
            var token = genToken(username);
            tokens[username] = token;
            response.status(200).json({"status": {"200": "Successfully authenticated"},"token": token});
        } else {
            response.status(501).json({"status": {"501": "Authentication Error"}});
        }
    });

router.route('/sql/:name')
    .post(parseUrlencoded, function(request, response){
        if (request.body.token) {
            var a = (request.body.token).split('|');
            var user = a[0];
            var token = a[1];
            if (!checkToken(user, token)) {
                response.status(501).json({"status": {"501": "Authentication Error"}});
            } else {
                if ((request.params.name).toLowerCase() == 'select') {
                    /*
                    TODO: put validations for database configurations
                     */
                    var sqlQuery = request.body.sqlquery;
                    dbconfigs.server = request.body.dbconfig.server;
                    dbconfigs.database = request.body.dbconfig.database;
                    dbconfigs.password = request.body.dbconfig.password;
                    dbconfigs.user = request.body.dbconfig.user;
                    dbconfigs.port = request.body.dbconfig.port;
                    var connectionpool = mysql.createPool({
                        host     : dbconfigs.server,
                        user     : dbconfigs.user,
                        password : dbconfigs.password,
                        database : dbconfigs.database
                    });
                    connectionpool.getConnection(function(err, connection) {
                        if (err) {
                            console.error('CONNECTION error: ',err);
                            response.statusCode = 503;
                            response.send({
                                result: 'error',
                                err:    err.code
                            });
                        } else {
                            var pre_query = new Date().getTime();
                            connection.query(sqlQuery, function(err, rows, fields) {
                                if (err) {
                                    console.error(err);
                                    response.statusCode = 500;
                                    response.send({
                                        result: 'error',
                                        err:    err.code
                                    });
                                }
                                var post_query = new Date().getTime();
                                var duration = (post_query - pre_query) / 1000;
                                var log = user + "|" + sqlQuery + "|" + duration + "|" + rows.length;
                                logwrite(log);
                                response.send({
                                    result: 'success',
                                    err:    '',
                                    fields: fields,
                                    json:   rows,
                                    length: rows.length,
                                    time:   duration
                                });
                                connection.release();
                            });

                        }
                    });
                }else{
                    console.log("response ending");
                    response.end("END");
                }
            }
        }else{
            console.log(request.body);
            response.status(500).json({"status": {"500": "No token found"}});
        }
    });

router.route('/close')
    .post(parseUrlencoded, function(request, response){
    if (request.body.token) {
        var a = (request.body.token).split('|');
        var user = a[0];
        var token = a[1];
        if (checkToken(user, token)) {
            if (closeSession(user)) {
                response.status(200).json({"status": {"200": "Successfully closed the session"}});
            }else{
                response.status(501).json({"status": {"501": "Failed to close the session"}});
            }
        }else{
            response.status(501).json({"status": {"501": "Failed to close the session"}});
        }
    }
    });
/*
TODO: implement authentication mechanism properly
*/

var authenticationCheck = function(user,pass){
    if (!user || !pass){
        return false;
    }else {
        return true;
    }
};

var  genToken = function(user){
    if (!tokens[user]) {
        var uuid5 = uuid.v4();
        var token = user + "|" + uuid5;
        return token;
    }else{
        return tokens[user]
    }
};

var checkToken = function(user,token){
    fullToken = genToken(user);
    if (tokens[user] == (user+"|"+token)){
        return true;
    }else{
        return false;
    }
};

var closeSession = function(user){
    if (tokens[user]) {
        delete tokens[user];
        return true;
    }else{
        return false;
    }
}
module.exports = router;