const fs = require('fs');
var date = new Date("2022-10-21");
var today = new Date();

const { exit } = require("process");
const { exec } = require("child_process");
const hashLib = require("../src/hash");
const httpLib = require("../src/http");
const parseLib = require("../src/parse");
const saveLib = require("../src/save");
const paths = require('../src/path');
const loggerLib = require("../src/logger");
const webhookLib = require("../src/webhook");

var theInterval;
var sideFetchCount = 0;

HasItemsUpdated = (items) => {
    var featuredHash = hashLib.uniqueDayhash(items.featured);
    var dailyHash = hashLib.uniqueDayhash(items.daily);

    var dataStorageContent = fs.readFileSync(paths.dataStorageJson(), 'utf8');
    if (dataStorageContent.length == 0) {
        loggerLib.warn('"data-storage.json" is empty', 'fetchRecentData.js', '0x7c4fd5', false);

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

    loggerLib.info('Recent fetches: ' + (sideFetchCount - 1), 'fetchRecentData.js', '0xfa6b95', false);
    sideFetchCount = 0;
    loggerLib.info('Shop updated!', 'fetchRecentData.js', '0x2df63f', false);
    return true;
}

AfterParsing = (items) => {
    if (items.featured.length <= 1 || items.daily.length != 6) {
        loggerLib.error('HTML doesnt result intended results', 'fetchRecentData.js', '0xc1fbd5', false);
    }

    if (HasItemsUpdated(items)) {
        saveLib.storeData(items, () => {
            date.setDate(date.getDate() + 1)
            onstart();
        }, date);
    } else {
        console.log("E_UNKNOWN_ERROR");
        exit(0);
    }
}

ParseHtml = (html) => {
    fs.writeFileSync('./lastRequest.html', html, 'utf-8');
    parseLib.parse(html, AfterParsing);
}

CheckShop = () => httpLib.request(ParseHtml, date.toISOString().split("T")[0]);

onstart = () => {
    loggerLib.info('Startup fetch recent data', 'fetchRecentData.js', '0x998803', false);
    //console.log(date)
    console.log(date.toISOString().split("T")[0])
    if (today.toISOString().split("T")[0] == date.toISOString().split("T")[0]) {
        console.log()
        exit(0);
    }
    //console.log(date.getTime())
    //date.setDate(date.getDate() + 1);
    CheckShop();
}

onstart();


