// const fmd5 = require('./api/fmd5');
var fmd5 = require('./api/regFileContent');
const fs = require('fs');
const gulp = require('gulp');
var Q = require('q');
// var tap = require('gulp-tap');


const file_cd = {
    // ele: 'D:/nodework/Crawler/dytt-reptitle/',
    ele: 'D:/git/SimpleAC/',
    ACDev: 'D:/git/SimpleAC/SimpleAC/',
}

/**
 *往指定目录插入文件，目录不存在创建目录，目前只支持创建一级子目录
 *
 * @param {*} dir
 * @param {*} fileName
 * @param {*} fileContent
 */
const writerToDir = function(dir, fileName, fileContent) {
    let url = function(dir, fileName) {
        return dir.replace(/\/+$/, '') + '/' + fileName
    }
    let callback = function() {
        fs.writeFile(url(dir, fileName), fileContent)
    }
    fs.readdir(dir, function(err, files, err) {
        if (!files) {
            fs.mkdir(dir, function(err) {
                if (err) {
                    return console.error(err);
                }
                callback();
            })
        } else {
            callback();
        }
    })
}

var md5name = [];
//测试rename
gulp.task('test', function() {
    return gulp.src([file_cd.ele + 'js/**/*.*', file_cd.ele + 'page/**/*.*'])
        .pipe(fmd5(function(regContent, promise) {
            md5name = md5name.concat(regContent);
        }, /g/))
        .on('end', function() {
            fs.writeFile('url.txt', md5name.join('\n'))
        })
})

gulp.task('qt', function(param) {
    var arr = [];
    for (let i = 0; i < 3; i++) {
        var t = Q.defer();
        arr.push(t.promise);
        t.resolve();
    }
    q.all(arr).then(function(param) {
        console.log(arr, 'q done')
    })
})



gulp.task('qq', function(param) {
    function createPromise(number) {
        return Q(number * number);
    }

    var array = [1, 2, 3, 4, 5];

    var promiseArray = array.map(function(number) {
        return createPromise(number);
    });

    Q.all(promiseArray).then(function(results) {
        console.log(results);
    });

    /** 运行结果
    [ 1, 4, 9, 16, 25 ]
    */
})


gulp.task('nginx_url', function() {
    var regNginx = require('./api/regNginx');
    return gulp.src('C:/Users/Administrator/Documents/Tencent Files/492055811/FileRecv/access.log')
        .pipe(regNginx(function(regContent, promise) {
            md5name = md5name.concat(regContent);
        }))
        .on('end', function() {
            var arr = md5name;
            var set = new Set(arr);
            var newArr = Array.from(set);
            fs.writeFile('nginx_url.txt', newArr.join('\n'))
        })
})

gulp.task('regCN', function() {
    var regNginx = require('./api/regCN');
    var md5name = [];
    return gulp.src([file_cd.ACDev + 'js/**/*.js', file_cd.ACDev + 'page/**/*.html',
            '!' + file_cd.ACDev + 'js/jqwidgets-4.1/**/*.js', '!' + file_cd.ACDev + 'js/dataTable/**/*.js', '!' + file_cd.ACDev + 'js/jsHistory/**/*.js',
            '!' + file_cd.ACDev + 'page/modules/helpDocument/**/*.*', '!' + file_cd.ACDev + 'page/test/**/*.*', '!' + file_cd.ACDev + 'js/modules/helpDocument/**/*.*',
            '!' + file_cd.ACDev + 'js/common/pinying.js', '!' + file_cd.ACDev + 'js/common/address.js', '!' + file_cd.ACDev + 'js/common/nationalCode.*', '!' + file_cd.ACDev + 'js/common/*.min.*'
        ])
        .pipe(regNginx(function(regContent, promise) {
            md5name = md5name.concat(regContent);
        }))
        .on('end', function() {
            var arr = md5name;
            var set = new Set(arr);
            var newArr = Array.from(set);
            var t = new Date();
            writerToDir('respone/' + t.getMonth() + '-' + t.getDate(), 'regCN.txt', newArr.join('\r\n'))
        })
})

/**
 *promise读取文件
 *
 * @param {*} path
 * @returns
 */
function readfileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

//文件差异比较
gulp.task('diffRegFile', function() {
    var t = new Date();
    Promise.all([readfileAsync('respone/' + t.getMonth() + '-' + t.getDate() + '/regCN.txt'), readfileAsync('respone/9-16/data0716.txt')])
        .then(function(...res) {
            var arr = res[0];
            // console.log(arr[0])
            // return;
            let oldData = arr[1].toString().split('\r\n');
            let data = arr[0].toString().split('\r\n');
            var newData = [];
            data.forEach(function(v, i) {
                var find = false;
                debugger
                oldData.forEach(function(ov, oi) {
                    if (oi == 0 && i == 0) {
                        console.log([v], [ov.split('=')[0]], ov.split('=')[0].trim() == v.trim())
                    }
                    if (ov.split('=')[0].trim() == v.trim()) {
                        find = true;
                    }
                })
                if (!find) {
                    newData.push(v.trim())
                }
            })
            console.log('newData:', newData)
            writerToDir('respone/' + t.getMonth() + '-' + t.getDate(), 'DiffRegCN.txt', newData.join('\r\n'))
        }).catch(function(e) {
            console.log(e)
        })
})


gulp.task('regCN_address', function() {
    var regNginx = require('./api/regCN');
    var md5name = [];
    return gulp.src(file_cd.ele + 'js/**/addressData_en.txt')
        .pipe(regNginx(function(regContent, promise) {
            md5name = md5name.concat(regContent);
        }))
        .on('end', function() {
            var arr = md5name;
            var set = new Set(arr);
            var newArr = Array.from(set);
            fs.writeFile('respone/regCN_address.txt', newArr.join('\r\n'))
        })
})

gulp.task('regCN_helpDocument', function() {
    var regNginx = require('./api/regCN');
    var md5name = [];
    return gulp.src([
            file_cd.ACDev + 'page/modules/helpDocument/**/*.*', file_cd.ACDev + 'js/modules/helpDocument/**/*.*',
            '!' + file_cd.ACDev + 'page/modules/helpDocument/**/*.pdf',
        ])
        .pipe(regNginx(function(regContent, promise) {
            md5name = md5name.concat(regContent);
        }))
        .on('end', function() {
            var arr = md5name;
            var set = new Set(arr);
            var newArr = Array.from(set);
            fs.writeFile('respone/regCN_helpDocument.txt', newArr.join('\r\n'))
        })
})
gulp.task('regCN2', function() {
    var regNginx = require('./api/regCN');
    var md5name = [];
    return gulp.src([file_cd.ACDev + '**/*.*'])
        .pipe(gulp.dest('respone/'));
})