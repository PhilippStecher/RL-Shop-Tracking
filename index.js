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


var lastseen_Featured_md5 = crypto.createHash('md5');

//#region Startparameters
const BaseURL = "rocket-league.com";
const URLpath = "/items/shop/"

const lastseenPath = "./data/last-seen.json";
const currentItemPath = "./data/current-items.json";
const MassivStoragePath = "./data/data-storage.json";

var TheInterval;

FixInterval_FitPerfect = () => {

}
//#endregion


//#region On update store data
class Packaging {
    constructor(FObj, DObj) {
        
    }
}
class DataStoring {
    constructor(FeaturedObj, DailyObj) {
        this.featured = FeaturedObj;
        this.daily = DailyObj;
    }
}
SaveData = (FEATURED = null, DAILY = null) => {
    //!fs.writeFileSync("./test.json", LastSeen_feat)
}

StoreData = (FEATURED = null, DAILY = null) => {
    
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
    Obj_Md5.update(JSON.stringify(Obj))
    return Obj_Md5.digest("hex")
}

WriteLastSeen = (FEATURED, DAILY) => {
    fs.writeFileSync(lastseenPath, JSON.stringify(new lastseenData(FEATURED, DAILY)), "utf-8")
}

CheckIfUpdated = (FEATURED, DAILY) => {
    Feathash = ReturnHashes(FEATURED);
    DailyHash = ReturnHashes(DAILY);

    LS_content = fs.readFileSync(lastseenPath, "utf8")
    if (LS_content.length == 0) {
        console.log("ERROR: Last seen file empty");
        WriteLastSeen(Feathash, DailyHash);
        return true;
    }

    var formated = JSON.parse(LS_content);

    if (formated.FeaturedHash == Feathash && formated.DailyHash == DailyHash) {
        console.log("Shop doesn't updated!");
        return false;
    } else {
        console.log("Shop updated!");
        //!WriteLastSeen(Feathash, DailyHash);
        //todo ...
        return true;
    }
    return false;
}
//#endregion

class FeaturedConstruct {
    constructor(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote) {
        var RandomMD5 = crypto.createHash('md5');
        RandomMD5.update(iName + iColor + iType);
        this.iID = RandomMD5.digest('hex');
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
    fs.writeFileSync("./data/current-items.json", JSON.stringify(Obj), "utf-8");
}

ParseHTML = (html) => {
    $ = cheerio.load(html.toString());
    //!----------------------------------------------
    /* Featured Items */
    var FeaturedIArr = [];
    for (var x = 1; x <= 2; x++) {
        var CurrFeat = $("body > main > section > div > div.rlg-item-shop > div.rlg-item-shop__featured > div:nth-child(" + x + ")").html()
        if (CurrFeat == null || CurrFeat == undefined) {
            console.log("ERROR: Something is wrong here!!!")
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
        var CurrDaily = $("body > main > section > div > div.rlg-item-shop > div.rlg-item-shop__daily > div:nth-child(" + x + ")").html()
        if (CurrDaily == null || CurrDaily == undefined) {
            console.log("ERROR: Something is wrong here!!!")
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
    console.log("Checking RL Shop");
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
                fs.writeFileSync("./ip.html", str, 'utf8');
                ParseHTML(str)
                /* console.log(str) */
            });

            resp.on('error', function (e) {
                console.log('Problem with request: ' + e.message);
            });
        }
    }).end(str);
}

onstart = () => {
    CheckShop();
    TheInterval = setInterval(() => {
        CheckShop();
    }, 3600000);
}

onstart();