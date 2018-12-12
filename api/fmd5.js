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

        var md5sum = crypto.createHash('md5');
        md5sum.update(file.contents);
        str = md5sum.digest('hex').toUpperCase();
        options(str, file);
        this.push(file);
        cb();
    });
};