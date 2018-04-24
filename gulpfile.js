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
            '!' + file_cd.ACDev + 'js/jqwidgets-4.1/**/*.js', '!' + file_cd.ACDev + 'js/dataTable/**/*.js', '!' + file_cd.ACDev + 'js/jsHistory/**/*.js'
        ])
        .pipe(regNginx(function(regContent, promise) {
            md5name = md5name.concat(regContent);
        }))
        .on('end', function() {
            var arr = md5name;
            var set = new Set(arr);
            var newArr = Array.from(set);
            fs.writeFile('respone/regCN.txt', newArr.join('\n'))
        })
})

gulp.task('regCN2', function() {
    var regNginx = require('./api/regCN');
    var md5name = [];
    return gulp.src([file_cd.ACDev + '**/*.*'])
        .pipe(gulp.dest('respone/'));
})