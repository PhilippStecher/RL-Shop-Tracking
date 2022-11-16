const fs = require('fs');
const metaData = require('../src/meta');
const paths = require('../src/path');
const loggerLib = require('../src/logger');

class ItemConstructor {
    constructor(iID, iName, iType, iCategory, iQuality, iColor, iCertification, iEdition, iPrice) {
        this.iID = iID;
        this.iName = iName;
        this.iType = iType;
        this.iQuality = iQuality;
        this.iCategory = iCategory;
        this.iColor = iColor;
        this.iCertification = iCertification;
        this.iEdition = iEdition;
        this.iPrice = iPrice;
    }
}

var splitType = (iType) => {
    var iQuality, iCategory = null;

    metaData.category.forEach((filter, index) => {
        if (iType.toLowerCase().includes(filter.toLowerCase())) {
            iCategory = filter;
            return;
        }
    })

    metaData.quality.forEach((filter, index) => {
        if (iType.toLowerCase().includes(filter.toLowerCase())) {
            iQuality = filter;
            return;
        }
    })

    if (!iQuality || !iCategory) {
        loggerLib.warn("Quality or category of items couldnt be parsed.\nCheck manuelly!", "reSort.js", "0x74a5fe")
    }

    return {
        iCategory: iCategory,
        iQuality: iQuality
    }
}


init = () => {
    var items = fs.readFileSync(paths.itemStorageJson(), "utf-8");

    if (items.length <= 2) {
        loggerLib.warn("Contents of Items is Empty", "reSort.js", "0xabcdef", false);
        return;
    }

    items = JSON.parse(items);

    var newItemArr = [];

    items.forEach((item) => {
        if (item.hasOwnProperty("iID") ) {
            if (item.hasOwnProperty("iType")) {
                var splittet = splitType(item.iType);
                if (!splittet.iQuality || !splittet.iCategory) {
                    loggerLib.warn("Parse Error: " + JSON.stringify(item), "reSort.js", "0xacd34f", false)
                }
                var newItem = new ItemConstructor(item.iID, item.iName, item.iType, splittet.iCategory, splittet.iQuality, item.iColor, item.iCertification, item.iEdition, item.iPrice)
                newItemArr.push(newItem);
            } else {
                loggerLib.error("Item Jumped: " + JSON.stringify(item), "reSort.js", "0x15a3c7", false);
                newItemArr.push(item);
            }
        } else {
            loggerLib.error("Item Jumped: " + JSON.stringify(item), "reSort.js", "0xa5c34b", false);
            newItemArr.push(item);
        }
    });

    if (items.length == newItemArr.length) {
        fs.writeFileSync(paths.itemStorageJson(), JSON.stringify(newItemArr, null, 4), "utf-8");
    } else {
        loggerLib.error("Array length missmatch\n- 'items' length: " + items.length + "\n- 'newItemsArr' length: " + newItemArr.length, "reSort.js", "0x9a8d8b", false);
    }
    loggerLib.info("Complete", "reSort.js", "aeb58a", false);
}

init();