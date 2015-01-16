module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.enter = function (msg, session, next) {
    var self = this;
    var uid = msg.uid;
    var sessionService = self.app.get('sessionService');
    var channelService = self.app.get('channelService');

    //duplicate log in
    if (!!sessionService.getByUid(uid)) {
        channelService.pushMessageByUids('kick','您的账号已经在别处登录。如不是本人的操作，请及时修改密码。',[{uid:uid,sid:self.app.get("serverId")}]);
        sessionService.kick(uid, 'kick');
    }

    session.bind(uid);
    session.on('closed', offline.bind(null, self.app));

    //put user into channel
    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), true, function (users) {
        next(null, {
            users: users
        });
    });
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var offline = function (app, session, reason) {
    console.log(reason);
    if (!session || !session.uid) {
        return;
    }
    if (reason !== 'kick') {
        app.rpc.chat.chatRemote.offline(session, session.uid, app.get('serverId'), null);
    }
};