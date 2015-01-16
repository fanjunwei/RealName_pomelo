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
    var httpHelper = this.app.get('httpHelper');
    httpHelper.get(this.app.get('django_url_base') + '/wadmin/online_change/?' + require('querystring').stringify(parm), function (err, data) {
        if (!err) {
            console.log('online:%s' + data);
            data = JSON.parse(data);
            cb(data);
        }
        else {
            res = {
                success: false,
                msg: data
            };
            console.log("Got error: " + data);
            cb(res);
        }
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

ChatRemote.prototype.push = function (rote, uid, message,cb) {
    var channelService = this.app.get('channelService');
    var channel = channelService.getChannel("chat", false);
    console.log('message',message);
    if (!!channel) {
        if (uid == 'all') {
            channel.pushMessage(rote, message);
        }
        else {
            var tuid = uid;
            var member = channel.getMember(tuid);
            if (member) {
                var tsid = member['sid'];
                channelService.pushMessageByUids(rote, message, [{
                    uid: tuid,
                    sid: tsid
                }]);
            }

        }
    }
};

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
ChatRemote.prototype.offline = function (uid, sid, cb) {
    var name = 'chat';
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if (!!channel) {
        channel.leave(uid, sid);
    }
    var parm = {
        uid: uid,
        state: '0'
    };
    var httpHelper = this.app.get('httpHelper');
    httpHelper.get(this.app.get('django_url_base') + '/wadmin/online_change/?' + require('querystring').stringify(parm), function (err, data) {
        if (!err) {
            console.log('offline:%s' + data);
            data = JSON.parse(data);
            if (cb)
                cb(data);
        }
        else {
            res = {
                success: false,
                msg: data
            };
            console.log("Got error: " + data);
            if (cb)
                cb(res);
        }
    });
};
