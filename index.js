const fs = require('fs');
const { exit } = require("process");
const { exec } = require("child_process");
const hashLib = require("./src/hash");
const httpLib = require("./src/http");
const parseLib = require("./src/parse");
const saveLib = require("./src/save");
const paths = require('./src/path');

var theInterval;
var sideFetchCount = 0;

TriggerWarning = (msg) => {
    console.log("[ERROR]: " + msg)
}

HasItemsUpdated = (items) => {
    var featuredHash = hashLib.uniqueDayhash(items.featured);
    var dailyHash = hashLib.uniqueDayhash(items.daily);

    var dataStorageContent = fs.readFileSync(paths.dataStorageJson(), 'utf8');
    if (dataStorageContent.length == 0) {
        TriggerWarning("'data-storage.json' is empty")

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

    console.log("[index.js]: Recent fetches: " + (sideFetchCount - 1));
    sideFetchCount = 0;
    console.log("[index.js]: Shop updated!");
    return true;
}

AfterParsing = (items) => {
    saveLib.current(items);

    if (HasItemsUpdated(items)) {
        saveLib.storeData(items);
    }
}

ParseHtml = (html) => parseLib.parse(html, AfterParsing);

CheckShop = () => httpLib.request(ParseHtml);

onstart = () => {
    exec("git pull", (error, data, getter) => {
        if (error) {
            TriggerWarning('Pull error - ' + error.message)
            return;
        }
        if (getter) {
            console.log("[GIT]: Pull successful")
            return;
        }
        console.log("[GIT]: Pulled");
    }).on("close", () => {
        sideFetchCount++;
        CheckShop();
    });
    theInterval = setInterval(() => {
        exec("git pull", (error, data, getter) => {
            if (error) {
                TriggerWarning('Pull error - ' + error.message)
                return;
            }
            if (getter) {
                console.log("[GIT]: Pull successful")
                return;
            }
            //console.log("[GIT]: Pulled");
        }).on("close", () => {
            sideFetchCount++;
            CheckShop();
        });
    }, 900000);
}

onstart();