const fs = require('fs');
const hashLib = require('./hash');
const paths = require('./path');
const loggerLib = require('./logger');

class CurrItemStoring {
    constructor(featured, daily) {
        this.Featured = featured;
        this.Daily = daily;
    }
}
module.exports.current = (obj) => {
    var jsonContent = new CurrItemStoring(obj.featured, obj.daily);
    fs.writeFileSync(paths.currentItemJson(), JSON.stringify(jsonContent, null, 4), "utf-8");
}


StoreItem = (item) => {
    var d = new Date();
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

    var itemStorage = fs.readFileSync(paths.itemStorageJson(), "utf-8");

    if (itemStorage.length != 0) {
        var doesItemExists = false;
        var tempParse = JSON.parse(itemStorage)
        tempParse.forEach((tempItem, index, array) => {
            if (tempItem.iID == item.iID) {
                doesItemExists = true;
                return;
            }
        })
    }


    if (doesItemExists) {
        return;
    }
    var itemStorageContent
    if (itemStorage.length == 0) {
        loggerLib.warn('"item-storage.json" is empty', 'save.js', '0x15d07f');
        itemStorageContent = [
            {
                "warn": "Missing data",
                "since": datestring
            }
        ];
    } else {
        itemStorageContent = JSON.parse(itemStorage);
    }
    itemStorageContent.push(item)
    fs.writeFileSync(paths.itemStorageJson(), JSON.stringify(itemStorageContent, null, 4), "utf-8");
    loggerLib.info("New item saved to DataBase", 'save.js', '0x312a2f')
}
class DayEntry {
    constructor(featuredObj, dailyObj) {
        this.featured = featuredObj;
        this.daily = dailyObj;
    }
}
class DayDataStorage {
    constructor(thePackedObj, featuredDayHash, dailyDayHash) {
        this.featuredHash = featuredDayHash;
        this.dailyHash = dailyDayHash;
        this.items = thePackedObj
        var d = new Date();
        this.pulltimeCode = Date.now();
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
        this.pulltimeText = datestring
    }
}
StoreDayData = (shrinkedFeatured, shrinkedDaily, featuredDayHash, dailyDayHash) => {
    var d = new Date();
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

    var jsonContent;
    var entrys = fs.readFileSync(paths.dataStorageJson(), "utf8");
    if (entrys.length == 0) {
        loggerLib.warn('"data-storage.json" is empty', 'save.js', '0xe8b13c');
        jsonContent = [
            {
                "warn": "Missing data",
                "since": datestring
            }
        ];

    } else {
        jsonContent = JSON.parse(entrys);
    }
    jsonContent.push(new DayDataStorage(new DayEntry(shrinkedFeatured, shrinkedDaily),featuredDayHash, dailyDayHash))
    fs.writeFileSync(paths.dataStorageJson(), JSON.stringify(jsonContent, null, 4), "utf-8");
}
module.exports.storeData = (obj, callback) => {
    console.log("----------------------------------------------")
    loggerLib.info('Checking RL Shop', 'save.js', '0x0a57ac')
    var featuredDayHash = hashLib.uniqueDayhash(obj.featured);
    var dailyDayHash = hashLib.uniqueDayhash(obj.daily);

    var shrinkedFeaturedData = [];
    obj.featured.forEach(item => {
        shrinkedFeaturedData.push({
            "iID": item.iID
        });
        StoreItem(item);
    });

    var shrinkedDailyData = [];
    obj.daily.forEach(item => {
        shrinkedDailyData.push({
            "iID": item.iID
        });
        StoreItem(item);
    });

    StoreDayData(shrinkedFeaturedData, shrinkedDailyData, featuredDayHash, dailyDayHash);
    loggerLib.info('New shop content saved', 'save.js', '0xe488e4')

    if (callback) callback();
}

