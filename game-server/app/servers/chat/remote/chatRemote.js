var http = require("http");
module.exports = function (app) {
    return new ChatRemote(app);
};

var ChatRemote = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

/**
 * Add user into chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
ChatRemote.prototype.add = function (uid, sid, flag, cb) {
    var name = 'chat';
    var channel = this.channelService.getChannel(name, flag);
    var username = uid;
    //var param = {
    //route: 'onAdd',
    //user: username
    //};
    //channel.pushMessage(param);

    if (!!channel) {
        channel.add(uid, sid);
    }
    var parm = {
        uid: uid,
        state: '1'
    };

    http.get(this.app.get('django_url_base') + '/wadmin/online_change/?' + require('querystring').stringify(parm), function (res) {
        var size = 0;
        var chunks = [];
        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });
        res.on('end', function () {
            var data = Buffer.concat(chunks, size).toString();
            console.log(data);
            data=JSON.parse(data);
            cb(data);
        });
    }).on('error', function (e) {
        res = {
            success: false,
            msg: e.message
        };
        console.log("Got error: " + e.message);
        cb(res);
    });

};

/**
 * Get user from chat channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
ChatRemote.prototype.get = function (name, flag) {
    var users = [];
    var channel = this.channelService.getChannel(name, flag);
    if (!!channel) {
        users = channel.getMembers();
    }
    for (var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    return users;
};

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
ChatRemote.prototype.kick = function (uid, sid, name, cb) {
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if (!!channel) {
        channel.leave(uid, sid);
    }
    var username = uid;
    var param = {
        route: 'onLeave',
        user: username
    };
    //channel.pushMessage(param);
    cb();
};
