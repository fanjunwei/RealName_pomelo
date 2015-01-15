var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'RealName');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
      {
        connector : pomelo.connectors.hybridconnector,
        heartbeat : 3
      });
});

app.configure('production|development', 'gate', function(){
  app.set('connectorConfig',
      {
        connector : pomelo.connectors.hybridconnector
      });
});

// app configure
app.configure('production|development', function() {
  // route configures
  app.route('chat', routeUtil.chat);

  // filter configures
  app.filter(pomelo.timeout());
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
