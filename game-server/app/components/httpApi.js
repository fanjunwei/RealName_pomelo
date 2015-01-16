// components/HttpApi.js
module.exports = function (app, opts) {
    return new HttpApi(app, opts);
};
var express = require('express');

var PORT = 3001;
var HttpApi = function (app, opts) {
    this.app = app;
    this.port = opts.port | PORT;
};

HttpApi.name = '__HttpApi__';

HttpApi.prototype.start = function (cb) {
    console.log('HttpApi Start');
    var self = this;
    var httpServer = express.createServer();
    httpServer.use(express.bodyParser());

    // url路由
    httpServer.post('/push/:route', function (req, res) {

    });

    httpServer.listen(this.port);

    process.nextTick(cb);
};

HttpApi.prototype.afterStart = function (cb) {
    process.nextTick(cb);
};

HttpApi.prototype.stop = function (force, cb) {
    process.nextTick(cb);
};