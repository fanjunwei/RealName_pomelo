var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var httpHelper = require("./app/util/httpHelper");
var httpapi = require('./app/components/httpApi');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'RealName');
app.set('django_url_base', 'http://127.0.0.1:8000');
app.set('http_api_port', 3001);
app.set('httpHelper', httpHelper);

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector
        });
    app.load(httpapi, {port: app.get('http_api_port')});
});

// app configure
app.configure('production|development', function () {
    // route configures
    app.route('chat', routeUtil.chat);

    // filter configures
    app.filter(pomelo.timeout());
});
app.configure('production|development', 'master', function () {
    httpHelper.get(app.get('django_url_base') + '/wadmin/clean_online/');//服务器开启时,清除在线记录

});
// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
