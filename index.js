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

var lastseen_Featured_md5 = crypto.createHash('md5');

//#region Startparameters
const BaseURL = "rocket-league.com";
const URLpath = "/items/shop/"

var TheInterval;

FixInterval_FitPerfect = () => {

}
//#endregion

class DataStoring {
    constructor() {

    }
}

class lastseenData {
    constructor(F, D) {
        this.FeaturedHash = F;
        this.DailyHash = D;
    }
}

class CurrItemStoring {
    constructor(ObjF, ObjD) {
        this.Featured_Items = ObjF;
        this.DailyItems = ObjD;
    }
}

SaveData = (FEATURED = null, DAILY = null) => {
    //!fs.writeFileSync("./test.json", LastSeen_feat)
}

SaveCurrItems = (Obj) => {
    fs.writeFileSync("./data/current-items.json", JSON.stringify(Obj), "utf-8");
}

ReturnHashes = (Obj) => {
    Obj.slice("iName")
    /* for (var x = 0; x < Obj.length; x++) {
        delete Obj[x].iUpvote;
        delete Obj[x].iDownvote;
        delete Obj[x].pulltimeCode;
        delete Obj[x].pulltimeText;
    } */
    console.log(Obj)
    var Obj_Md5 = crypto.createHash('md5');
    Obj_Md5.update(JSON.stringify(Obj))
    return Obj_Md5.digest("hex")
}

CheckIfUpdated = (FEATURED, DAILY) => {

}

class FeaturedConstruct {
    constructor(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote) {
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
        var iType = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-category").html().replaceAll("<br>", " ");
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
    //*console.table(ObjFeatLeft)
    //*console.table(ObjFeatRight)

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
        var iType = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-category").html().replaceAll("<br>", " ");
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
    FeatForHash = FeaturedIArr;
    DailyForHash = DailyIArr;
    /* Delete for Hashing */


    /* lastseen_Featured_md5.update(JSON.stringify(DailyForHash))
    var LastSeen_feat = lastseen_Featured_md5.digest("hex") */
    SaveCurrItems(new CurrItemStoring(FeaturedIArr, DailyIArr));
    console.log(ReturnHashes(FeatForHash))
    console.log(ReturnHashes(DailyForHash))
    

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
                ParseHTML(str)
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
    }, 3600000);
}

onstart();