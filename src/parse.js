const { exec } = require("child_process");
const cheerio = require("cheerio");
const hashLib = require("./hash");
const loggerLib = require('./logger');
const metaData = require('./meta');

var featuredItemArr = [];
var dailyItemArr = [];

class ItemConstructor {
    constructor(iName, iType, iCategory, iQuality, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote) {
        this.iID = hashLib.itemHash(iName, iType, iColor, iPrice, iCertification, iEdition)
        this.iName = iName;
        this.iType = iType;
        this.iQuality = iQuality;
        this.iCategory = iCategory;
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
        loggerLib.warn("Quality or category of items couldnt be parsed.\nCheck manuelly!", "parse.js", "0xf0a0ff")
    }

    return {
        iCategory: iCategory,
        iQuality: iQuality
    }
}

featuredItemParser = async () => {
    for (var x = 1; x <= 2; x++) {
        var CurrFeat = $(".rlg-item-shop__featured > a:nth-child(" + x + ")").html()
        if (CurrFeat == null || CurrFeat == undefined) {
            loggerLib.error("The HTML pulled is invalid!", 'parse.js', '0x6252b9');
            return;
        }
        CurrCheer = cheerio.load(CurrFeat.toString());
        var iName = CurrCheer("div.rlg-item-shop__item-content > h1").text().trim();

        var iType = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-category").html().replace("<br>", " ");
        var splitted = splitType(iType);
        var iQuality = splitted.iQuality;
        var iCategory = splitted.iCategory;

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
        var iUpvote = CurrCheer("button.rlg-item-shop__item-vote.--up > span").text().trim();
        var iDownvote = CurrCheer("button.rlg-item-shop__item-vote.--down > span").text().trim();
        featuredItemArr.push(new ItemConstructor(iName, iType, iCategory, iQuality, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote))
    }
    return;
}

dailyItemParser = async () => {
    for (var x = 1; x <= 6; x++) {
        var CurrDaily = $(".rlg-item-shop__daily > a:nth-child(" + x + ")").html()
        if (CurrDaily == null || CurrDaily == undefined) {
            loggerLib.error("The HTML pulled is invalid!", 'parse.js', '0xdfa04b');
            return;
        }
        CurrCheer = cheerio.load(CurrDaily.toString());
        var iName = CurrCheer("div.rlg-item-shop__item-content > h1").text().trim();

        var iType = CurrCheer("div.rlg-item-shop__item-content > div.rlg-item-shop__item-category").html().replace("<br>", " ");
        var splitted = splitType(iType);
        var iQuality = splitted.iQuality;
        var iCategory = splitted.iCategory;

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
        var iUpvote = CurrCheer("button.rlg-item-shop__item-vote.--up > span").text().trim();
        var iDownvote = CurrCheer("button.rlg-item-shop__item-vote.--down > span").text().trim();
        dailyItemArr.push(new ItemConstructor(iName, iType, iCategory, iQuality, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote))
    }
    return;
}

module.exports.parse = (html, callback) => {
    $ = cheerio.load(html.toString());
    featuredItemArr = [];
    dailyItemArr = [];

    featuredItemParser();
    dailyItemParser();
    
    callback({
        featured: featuredItemArr,
        daily: dailyItemArr
    });
    return;
}