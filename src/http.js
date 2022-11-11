const fs = require('fs');
const paths = require('./path');
const loggerLib = require('./logger');

var request = require('request'),
    http = require('follow-redirects').http,
    request = request.defaults({
        jar: true
    });

module.exports.request = (callback) => {
    var str = '';

    var options = {
        hostname: paths.url,
        path: paths.urlPath + '?' + new Date().getTime(),
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
            /* 'Cookie': cookie, */
            'Accept': '/',
            'Connection': 'keep-alive'
        }
    };
    http.request(options, function (resp) {
        resp.setEncoding('utf8');
        if (resp.statusCode) {
            resp.on('data', function (part) {
                str += part;
            });
            resp.on('end', function (part) {
                callback(str);
            });

            resp.on('error', function (e) {
                loggerLib.error('Problem with request: ' + e.message, 'http.js', '0x8ce455')
            });
        }
    }).end(str);
}