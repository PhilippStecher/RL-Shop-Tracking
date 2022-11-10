const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");
const fs = require('fs');
const path = require('path');
const { exit } = require("process");
const cheerio = require("cheerio");
const { start } = require("prompt");
const crypto = require("crypto");
var request = require('request'),
    http = require('follow-redirects').http,
    request = request.defaults({
        jar: true
    });

var globalTunnel = require('global-tunnel');
const { Console } = require('console');
const { exec } = require("child_process");

//?todo Randomize IP
//https://astexplorer.net/
//https://github.com/acornjs/acorn
//https://www.npmjs.com/package/ast-parser 
//https://www.npmjs.com/package/acorn
//https://blog.sessionstack.com/how-javascript-works-parsing-abstract-syntax-trees-asts-5-tips-on-how-to-minimize-parse-time-abfcf7e8a0c8

var lastseen_Featured_md5 = crypto.createHash('md5');

//#region Startparameters
const BaseURL = "rocket-league.com";
const URLpath = "/items/shop/"

const lastseenPath = "./oldData/last-seen.json";
const currentItemPath = "./oldData/current-items.json";
const MassivStoragePath = "./oldData/data-storage.json";
const AllItemsPath = "./oldData/itemstoring.json";

var TheInterval;

FixInterval_FitPerfect = () => {

}
//#endregion

//#region Warnsystem
TriggerWarning = (msg) => {
    //todo
    console.log("[ERROR]: " + msg)
}
//#endregion

//#region Item to ID
GetIDofItem = (iName, iType, iColor, iPrice) => {
    return new crypto.createHash('md5').update(iName + iType + iColor + iPrice).digest('hex');
}

class ItemToID {
    constructor(iName, iType, iColor, iPrice, DailyORFeatured) {
        this.iID = GetIDofItem(iName, iType, iColor, iPrice);
        this.iName = iName;
        this.iType = iType;
        this.iColor = iColor;
        this.iPrice = iPrice;
        this.ForD = DailyORFeatured;
    }
}

ItemToStorage = (ItemID, ItemObj) => {
    /* console.log("A item id = " + ItemID) */
    var Itemstorage = fs.readFileSync(AllItemsPath, 'utf8');

    //!Check if Item already exists

    var ItemAllreadyExists = false;
    if (Itemstorage.length != 0) {
        var tempParse = JSON.parse(Itemstorage)
        /* Check if Item is already in storage */
        tempParse.forEach(item => {
            if (item.iID == ItemID) {
                ItemAllreadyExists = true;
                return
            }
        })
    }

    if (ItemAllreadyExists)
        return;


    if (Itemstorage.length == 0) {
        var ItemStorageCNT = [];
        ItemStorageCNT.push(ItemObj)
    } else {
        var ItemStorageCNT = JSON.parse(Itemstorage)
        ItemStorageCNT.push(ItemObj)
    }
    fs.writeFileSync(AllItemsPath, JSON.stringify(ItemStorageCNT, null, 4), "utf-8");
    console.log("[index.js]: New item saved to DataBase");


}
//#endregion

//#region On update store data
class Packaging {
    constructor(FObj, DObj) {
        this.featured = FObj;
        this.daily = DObj;
    }
}
class DataStoring {
    constructor(thePackedObj) {
        this.items = thePackedObj
        var d = new Date();
        this.pulltimeCode = Date.now();
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
        this.pulltimeText = datestring
    }
}


StoreData = (FEATURED = null, DAILY = null) => {

    console.log("----------------------------------------------")
    console.log("[index.js]: Checking RL Shop");
    var time = Date.now();
    var d = new Date();
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);


    var ShrinkDataF = [];
    var ShrinkDataD = [];
    FEATURED.forEach((Fitem) => {
        var iHash = GetIDofItem(Fitem.iName, Fitem.iType, Fitem.iColor, Fitem.iPrice);
        ItemToStorage(iHash, new ItemToID(Fitem.iName, Fitem.iType, Fitem.iColor, Fitem.iPrice, "FEATURED"))
        ShrinkDataF.push({ "iID": iHash, "pulltimeCode": Fitem.pulltimeCode, "pulltimeText": Fitem.pulltimeText })
    })
    DAILY.forEach((Ditem) => {
        var iHash = GetIDofItem(Ditem.iName, Ditem.iType, Ditem.iColor, Ditem.iPrice);
        ItemToStorage(iHash, new ItemToID(Ditem.iName, Ditem.iType, Ditem.iColor, Ditem.iPrice, "DAILY"))
        ShrinkDataD.push({ "iID": iHash, "pulltimeCode": Ditem.pulltimeCode, "pulltimeText": Ditem.pulltimeText })
    })



    var CurrentResults = fs.readFileSync(MassivStoragePath, "utf-8");
    if (CurrentResults.length == 0) {
        TriggerWarning("Data-Storage file is empty!")
        var jsoncnt = [];
        jsoncnt.push(new DataStoring(new Packaging(ShrinkDataF, ShrinkDataD)))
    } else {
        var jsoncnt = JSON.parse(CurrentResults)
        jsoncnt.push(new DataStoring(new Packaging(ShrinkDataF, ShrinkDataD)))
    }
    fs.writeFileSync(MassivStoragePath, JSON.stringify(jsoncnt, null, 4), "utf-8");
    console.log("[index.js]: New shop content saved.");
    Github_Reload();
}
//#endregion

//#region Last seen idk
class lastseenData {
    constructor(F, D) {
        this.FeaturedHash = F;
        this.DailyHash = D;
    }
}

ReturnHashes = (Obj) => {
    for (var x = 0; x < Obj.length; x++) {
        delete Obj[x].iUpvote;
        delete Obj[x].iDownvote;
        delete Obj[x].pulltimeCode;
        delete Obj[x].pulltimeText;
    }
    var Obj_Md5 = crypto.createHash('md5');
    Obj_Md5.update(JSON.stringify(Obj, null, 4))
    return Obj_Md5.digest("hex")
}

Github_Reload = () => {
    exec("sudo sh gitpush.sh", (error, data, getter) => {
        if (error) {
            console.log("[GIT.Reload]: Push error")
            TriggerWarning('Push error - ' + error.message)
            return;
        }
        if (getter) {
            console.log("[GIT.Reload]: Push successful")
            return;
        }
        console.log("[GIT.Reload]: Pushed");
    }).on("close", () => {
        exec("git pull", (error, data, getter) => {
            if (error) {
                console.log("[GIT.Reload]: Pull error")
                TriggerWarning('Pull error - ' + error.message)
                return;
            }
            if (getter) {
                console.log("[GIT.Reload]: Pull successful")
                return;
            }
            console.log("[GIT.Reload]: Pulled");
        })
    });
}

WriteLastSeen = (FEATURED, DAILY) => {
    fs.writeFileSync(lastseenPath, JSON.stringify(new lastseenData(FEATURED, DAILY), null, 4), "utf-8")
}

CheckIfUpdated = (FEATURED, DAILY) => {
    Feathash = ReturnHashes(FEATURED);
    DailyHash = ReturnHashes(DAILY);

    LS_content = fs.readFileSync(lastseenPath, "utf8")
    if (LS_content.length == 0) {
        TriggerWarning("LastSeen file is empty!");
        WriteLastSeen(Feathash, DailyHash);
        return true;
        CheckShop();
    }

    var formated = JSON.parse(LS_content);

    if (formated.FeaturedHash == Feathash && formated.DailyHash == DailyHash) {
        console.log("[index.js]: Shop doesn't updated!");
        return false;
    } else {
        console.log("[index.js]: Shop updated!");
        return true;
    }
    return false;
}
//#endregion

class FeaturedConstruct {
    constructor(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote) {
        this.iID = GetIDofItem(iName, iType, iColor, iPrice)
        this.iName = iName;
        this.iType = iType;
        this.iColor = iColor;
        this.iCertification = iCertification;
        this.iEdition = iEdition;
        this.iPrice = iPrice;
        this.iUpvote = iUpvote;
        this.iDownvote = iDownvote;
        var d = new Date();
        this.pulltimeCode = Date.now();
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
        this.pulltimeText = datestring
    }
}

class CurrItemStoring {
    constructor(ObjF, ObjD) {
        this.Featured_Items = ObjF;
        this.DailyItems = ObjD;
    }
}

SaveCurrItems = (Obj) => {
    fs.writeFileSync("./oldData/current-items.json", JSON.stringify(Obj, null, 4), "utf-8");
}

ParseHTML = (html) => {
    $ = cheerio.load(html.toString());
    //!----------------------------------------------
    /* Featured Items */
    var FeaturedIArr = [];
    for (var x = 1; x <= 2; x++) {
        var CurrFeat = $(".rlg-item-shop__featured > a:nth-child(" + x + ")").html()
        if (CurrFeat == null || CurrFeat == undefined) {
            console.log("ERROR: The HTML pulled is invalid!")
            TriggerWarning("The HTML pulled is invalid!")
            return;
        }
        CurrCheer = cheerio.load(CurrFeat.toString());
        var iName = CurrCheer("div.rlg-item-shop__item-content > h1").text().trim();
        var iType = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-category").html().replace("<br>", " ");
        var iColor = CurrCheer("div.rlg-item-shop__image-meta > div.rlg-item-shop__paint").text().trim();
        /* !..! */
        var iCertification;
        if (CurrCheer("div.rlg-item-shop__image-meta > div.rlg-item-shop__cert").text().trim() != "") {
            iCertification = CurrCheer("div.rlg-item-shop__image-meta > div.rlg-item-shop__cert").text().trim();
        } else {
            iCertification = null;
        }
        //?------------------------------------------
        var iEdition;
        if (CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-edition").text().trim() != "") {
            iEdition = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-edition").text().trim();
        } else {
            iEdition = null;
        }
        /* !..! */

        var iPrice = CurrCheer("div.rlg-item-shop__meta > div.rlg-item-shop__item-credits").text().trim();
        var iUpvote = CurrCheer("div.rlg-item-shop__meta > a:nth-child(1) > span").text().trim();
        var iDownvote = CurrCheer("div.rlg-item-shop__meta > a:nth-child(2) > span").text().trim();

        FeaturedIArr.push(new FeaturedConstruct(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote))
    }
    //!----------------------------------------------
    var DailyIArr = [];
    for (var x = 1; x <= 6; x++) {
        var CurrDaily = $(".rlg-item-shop__daily > a:nth-child(" + x + ")").html()
        if (CurrDaily == null || CurrDaily == undefined) {
            console.log("ERROR: The HTML pulled is invalid!")
            TriggerWarning("The HTML pulled is invalid!")
            return;
        }
        CurrCheer = cheerio.load(CurrDaily.toString());
        var iName = CurrCheer("div.rlg-item-shop__item-content > h1").text().trim();
        var iType = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-category").html().replace("<br>", " ");
        var iColor = CurrCheer("div.rlg-item-shop__image-meta > div.rlg-item-shop__paint").text().trim();

        /* !..! */
        var iCertification;
        if (CurrCheer("div.rlg-item-shop__image-meta > div.rlg-item-shop__cert").text().trim() != "") {
            iCertification = CurrCheer("div.rlg-item-shop__image-meta > div.rlg-item-shop__cert").text().trim();
        } else {
            iCertification = null;
        }
        //?------------------------------------------
        var iEdition;
        if (CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-edition").text().trim() != "") {
            iEdition = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-edition").text().trim();
        } else {
            iEdition = null;
        }
        /* !..! */

        var iPrice = CurrCheer("div.rlg-item-shop__meta > div.rlg-item-shop__item-credits").text().trim();
        var iUpvote = CurrCheer("div.rlg-item-shop__meta > a:nth-child(1) > span").text().trim();
        var iDownvote = CurrCheer("div.rlg-item-shop__meta > a:nth-child(2) > span").text().trim();
        DailyIArr.push(new FeaturedConstruct(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote))
    }
    //!----------------------------------------------
    //*console.log(FeaturedIArr);
    //*console.log(DailyIArr);
    SaveCurrItems(new CurrItemStoring(FeaturedIArr, DailyIArr));
    //!----------------------------------------------
    if (CheckIfUpdated(FeaturedIArr, DailyIArr)) { //?The Store Updated everything
        StoreData(FeaturedIArr, DailyIArr);
        //todo Fix the interval so it fit perfect
        WriteLastSeen(ReturnHashes(FeaturedIArr), ReturnHashes(DailyIArr));
    } else {

    }
}

CheckShop = () => {
    var str = '';
    var uri = BaseURL;

    var options = {
        hostname: uri,
        path: URLpath,
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
                console.log("[index.js]: Side fetched")
                fs.writeFileSync("./lastRequest.html", str, 'utf8');
                ParseHTML(str)
                /* if (str.lenght < 2) {
                    
                } else {
                    console.log("HTML Response empty")
                    TriggerWarning("HTML Response empty")
                } */

                /* console.log(str) */
            });

            resp.on('error', function (e) {
                TriggerWarning('Problem with request: ' + e.message)
            });
        }
    }).end(str);
}

onstart = () => {
    exec("git pull", (error, data, getter) => {
        if (error) {
            console.log("[GIT]: Pull error")
            TriggerWarning('Pull error - ' + error.message)
            return;
        }
        if (getter) {
            console.log("[GIT]: Pull successful")
            return;
        }
        console.log("[GIT]: Pulled");
    }).on("close", () => {
        CheckShop();
    });
    TheInterval = setInterval(() => {
        exec("git pull", (error, data, getter) => {
            if (error) {
                console.log("[GIT]: Pull error")
                TriggerWarning('Pull error - ' + error.message)
                return;
            }
            if (getter) {
                console.log("[GIT]: Pull successful")
                return;
            }
            console.log("[GIT]: Pulled");
        }).on("close", () => {
            CheckShop();
        });
    }, 900000);
}

onstart();