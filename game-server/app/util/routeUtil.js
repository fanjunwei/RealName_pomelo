var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.chat = function (session, msg, app, cb) {
    var chatServers = app.getServersByType('chat');

    if (!chatServers || chatServers.length === 0) {
        cb(new Error('can not find chat servers.'));
        return;
    }

    //var res = dispatcher.dispatch(session.get('rid'), chatServers);
    var res = chatServers[0];//只使用一个服务实例

    cb(null, res.id);
};