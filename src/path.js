const fs = require('fs');
const { exit } = require("process");
const loggerLib = require('./logger');

module.exports.url = "rocket-league.com";
module.exports.urlPath = "/items/shop/";

BasePath = (function () {
    var GamingPc = "C://Users/phili/Desktop/Desktop/SuaJS/Githubs/RL-Shop-Tracking/";
    var Laptop = "C://Users/Philipp Stecher/Desktop/Coding/Githubs/RL-Shop-Tracking/";
    var Laptop1 = "C://Users/Phillip Stecher/Desktop/Coding/Githubs/RL-Shop-Tracking/";
    var Server = "/home/Nodejs/RL-Shop-Tracking/";

    var arr = [GamingPc, Laptop, Laptop1, Server];

    var foundDir = null;
    arr.forEach(function (path) {
        if (!foundDir) {
            if (fs.existsSync(path)) {
                foundDir = path;
            }
        }
    })

    if (!!foundDir) {
        return foundDir;
    } else {
        loggerLib.error('E_NO_BASEPATH_FOUND', 'path.js', '0xaad19b')
        exit(1);
    }
});

const dataPath = "data/"

module.exports.currentItemJson = () => { return BasePath() + dataPath + "current-items.json"};

module.exports.dataStorageJson = () => { return BasePath() + dataPath + "data-storage.json"};

module.exports.itemStorageJson = () => { return BasePath() + dataPath + "item-storage.json"};

module.exports.logText = () => { return BasePath() + "Logs.txt" };