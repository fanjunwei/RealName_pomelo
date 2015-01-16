/**
 * Created by fanjunwei003 on 15/1/16.
 */
var http = require("http");
module.exports.get = function (url, cb) {

    http.get(url, function (res) {
        var size = 0;
        var chunks = [];
        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        });
        res.on('end', function () {
            var data = Buffer.concat(chunks, size).toString();
            if (cb)
                cb(false, data);
        });
    }).on('error', function (e) {
        if (cb)
            cb(true, e.message);
    });
};