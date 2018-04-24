var crypto = require('crypto');
var through = require('through2');

module.exports = function(options, reg) {
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
        var reg = /[\u4E00-\u9FA5]+/g;
        // var arr = new Array(content.match(reg));
        var arr = content.match(reg);
        if (arr !== null) {
            arr.push(file.path + '------------------------------------------------------------------------------------------------------------------------------------------------------------------')
        }

        options(arr);
        this.push(file);
        cb();
    });
};