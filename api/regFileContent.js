var crypto = require('crypto');
var through = require('through2');

module.exports = function(options) {
    return through.obj(function(file, enc, cb) {

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        const content = file.contents.toString();
        const arr = content.split('\n');
        var arr_new = [];
        var reg = /url\: [a-z A-Z0-9\/'"\+\.]*,/;
        for (let i = 0; i < arr.length; i++) {
            var ele = arr[i];
            var bool = reg.test(ele);
            if (bool) {
                // reg.exec(ele)
                var t = reg.exec(ele)
                arr_new.push(t[0])
            }
        }
        options(arr_new);
        this.push(file);
        cb();
    });
};