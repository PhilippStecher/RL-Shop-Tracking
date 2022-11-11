const fs = require('fs');
const { exit } = require("process");
const { exec } = require("child_process");
const hashLib = require("./src/hash");
const httpLib = require("./src/http");
const parseLib = require("./src/parse");
const saveLib = require("./src/save");
const paths = require('./src/path');
const loggerLib = require("./src/logger");
const fcmLib = require("./src/firebase");

var theInterval;
var sideFetchCount = 0;

PushChanges = () => {
    exec("sudo sh gitpush.sh", (error, data, getter) => {
        if (error) {
            loggerLib.error('GIT Push Error - ' + error.message, 'index.js', '0xc1699d')
            return;
        }
        if (getter) {
            loggerLib.info('Push successful', 'index.js', '0xac99f6')
            return;
        }
        loggerLib.info('Git pushed', 'index.js', '0x11a6e8')
    }).on("close", () => {
        exec("git pull", (error, data, getter) => {
            if (error) {
                loggerLib.error('Pull Error - ' + error.message, 'index.js', '0xd3866e')
                return;
            }
            if (getter) {
                loggerLib.info('Pull successful', 'index.js', '0x224aa0')
                return;
            }
            loggerLib.info('Git pulled', 'index.js', '0x1583c1')
        })
    });
}

HasItemsUpdated = (items) => {
    var featuredHash = hashLib.uniqueDayhash(items.featured);
    var dailyHash = hashLib.uniqueDayhash(items.daily);

    var dataStorageContent = fs.readFileSync(paths.dataStorageJson(), 'utf8');
    if (dataStorageContent.length == 0) {
        loggerLib.warn('"data-storage.json" is empty', 'index.js', '0x7c4fd5')

        dataStorageContent = [
            {
                featuredHash: '',
                dailyHash: ''
            }
        ];

    } else {
        dataStorageContent = JSON.parse(dataStorageContent);
    }

    var lastEntry = dataStorageContent[dataStorageContent.length - 1];
    if (lastEntry.featuredHash == featuredHash && lastEntry.dailyHash == dailyHash) {
        return false;
    }

    loggerLib.info('Recent fetches: ' + (sideFetchCount - 1), 'index.js', '0xfa6b95')
    sideFetchCount = 0;
    loggerLib.info('Shop updated!', 'index.js', '0x2df63f')
    return true;
}

AfterParsing = (items) => {
    if (items.featured.length != 2 || items.daily.length != 6) {
        loggerLib.error('HTML doesnt result intended results', 'index.js', '0xc1fbd5')
        //* return or exit!
    }
    saveLib.current(items);

    if (HasItemsUpdated(items)) {
        saveLib.storeData(items, PushChanges);
    }
}

ParseHtml = (html) => parseLib.parse(html, AfterParsing);

CheckShop = () => httpLib.request(ParseHtml);

onstart = () => {
    loggerLib.info('Startup', 'index.js', '0x998803');
    exec("git pull", (error, data, getter) => {
        if (error) {
            loggerLib.info('Pull error - ' + error.message, 'index.js', '0xc9f5bb')
            return;
        }
        if (getter) {
            loggerLib.info('Git pulled successful', 'index.js', '0x0fb38a')
            return;
        }
        loggerLib.info('Git pulled', 'index.js', '0x0677cd')
    }).on("close", () => {
        sideFetchCount++;
        CheckShop();
    });
    theInterval = setInterval(() => {
        exec("git pull", (error, data, getter) => {
            if (error) {
                loggerLib.info('Pull error - ' + error.message, 'index.js', '0x5c9bfc')
                return;
            }
            if (getter) {
                loggerLib.info('Git pulled successful', 'index.js', '0x959174')
                return;
            }
            //loggerLib.info('Git pulled', 'index.js', '0x6f6bfc')
        }).on("close", () => {
            sideFetchCount++;
            CheckShop();
        });
    }, 5000);
}

onstart();