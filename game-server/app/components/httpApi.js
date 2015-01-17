// components/HttpApi.js

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PORT = 3001;

module.exports = function (app, opts) {
    return new HttpApi(app, opts);
};

var HttpApi = function (app, opts) {
    this.app = app;
    this.port = opts.port | PORT;
};

HttpApi.name = '__HttpApi__';

HttpApi.prototype.start = function (cb) {
    console.log('HttpApi Start');
    var self = this;
    var httpServer = express();
    httpServer.use(bodyParser.json());
    httpServer.use(bodyParser.urlencoded({extended: false}));
    httpServer.use(cookieParser());


    // url路由
    httpServer.post('/push/:route/:uid', function (req, res) {
        var route = req.params.route;
        var uid = req.params.uid;
        var message = req.body.message;
        console.log('http server message', message);
        self.app.rpc.chat.chatRemote.push("chat", route, uid, message, null);
        res.send('ok');
    });

    httpServer.listen(this.port);

    process.nextTick(cb);
};

HttpApi.prototype.afterStart = function (cb) {
    process.nextTick(cb);
};

HttpApi.prototype.stop = function (force, cb) {
    var httpHelper = this.app.get('httpHelper');
    httpHelper.get(app.get('django_url_base') + '/wadmin/clean_online/');//服务器关闭时,清除在线记录
    process.nextTick(cb);
};