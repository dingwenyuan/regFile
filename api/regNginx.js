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
        const arr = content.split('\n');
        var arr_new = [];
        // var _reg_pass = /AccountingCloud[a-z A-Z0-9\/'"\+\.\_\?\=\-\&]*HTTP\/1\.1/;
        // var _reg_bingo = /SimpleAC\/CXF\/rs[a-z A-Z0-9\/'"\+\.\_\?\=\-\&]*HTTP\/1\.1/;
        var _reg_pass = /AccountingCloud[a-z A-Z0-9\/'"\+\.\_\?\=\-\&]*\?/;
        var _reg_bingo = /SimpleAC\/CXF\/rs[a-z A-Z0-9\/'"\+\.\_\?\=\-\&]*\?/;
        for (let i = 0; i < arr.length; i++) {
            var ele = arr[i];
            var pass = !_reg_pass.test(ele);
            var bingo = _reg_bingo.test(ele);
            if (pass && bingo) {
                var t = _reg_bingo.exec(ele)
                arr_new.push(t[0].replace('HTTP/1.1', ''))
            }
        }
        options(arr_new);
        this.push(file);
        cb();
    });
};