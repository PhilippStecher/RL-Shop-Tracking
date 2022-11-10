const fs = require('fs');
const paths = require('./path');

var request = require('request'),
    http = require('follow-redirects').http,
    request = request.defaults({
        jar: true
    });

TriggerWarning = (msg) => {
    console.log("[ERROR]: " + msg)
}

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
                fs.writeFileSync("../lastRequest.html", str.toString(), 'utf8');
                callback(str);
            });

            resp.on('error', function (e) {
                TriggerWarning('Problem with request: ' + e.message)
            });
        }
    }).end(str);
}