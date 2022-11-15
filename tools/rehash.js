const hashLib = require("../src/hash");

const dataStoragePath = '../data/data-storage.json';
const itemStoringPath = '../data/itemstoring.json';

const fs = require('fs');
const { exit } = require("process");

var executeHash = (iName, iType, iColor, iPrice, iCertification, iEdition) => hashLib.itemHash(iName, iType, iColor, iPrice, iCertification, iEdition);

const walkThroughItems = (itemStoring, itemStoringJson, dataStorage, dataStorageJson) => {
    var oldIdArr = [];
    var newIdArr = [];

    var promise = new Promise((resolve, reject) => {
        itemStoringJson.forEach((item, index, array) => {
            var oldId = item.iID;
            var newId = executeHash(item.iName, item.iType, item.iColor, item.iPrice, item.iCertification, item.iEdition)
    
            if (!oldIdArr.includes(oldId)) {
                if (!newIdArr.includes(newId)) {
                    try {
                        itemStoring = itemStoring.replaceAll(oldId, newId);
                        dataStorage = dataStorage.replaceAll(oldId, newId);
                    } catch (e) {
                        console.warn("Error: " + e.message);
                    }
    
                    oldIdArr.push(oldId)
                    newIdArr.push(newId)
                    console.log("Old ID: " + oldId)
                    console.log("New ID: " + newId)
                } else {
                    console.warn("Duplicate in New Ids found: " + newId);
                    exit(1);
                }
            } else {
                console.warn("Duplicate in Old Ids found: " + oldId);
                exit(1);
            }
            if (index === array.length -1) resolve();
        });
    });

    promise.then(() => {
        fs.writeFileSync("../newHashData/itemstoring.json", itemStoring, "utf8");
        fs.writeFileSync("../newHashData/data-storage.json", dataStorage, "utf8");
        console.log("Old Ids count: " + oldIdArr.length)
        console.log("New Ids count: " + newIdArr.length)
    })
}

init = () => {
    var dataStorage = fs.readFileSync(dataStoragePath, 'utf8');
    var itemStoring = fs.readFileSync(itemStoringPath, 'utf8');

    if (dataStorage.length < 1) {
        console.log("Data storage is not available")
        return;
    }

    if (itemStoring.length < 1) {
        console.log("Item storage is not available")
        return;
    }

    var dataStorageJson = JSON.parse(dataStorage);
    var itemStoringJson = JSON.parse(itemStoring);

    walkThroughItems(itemStoring, itemStoringJson, dataStorage, dataStorageJson);
}

init();