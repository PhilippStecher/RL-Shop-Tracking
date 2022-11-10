const { exec } = require("child_process");
const cheerio = require("cheerio");
const hashLib = require("./hash");

var featuredItemArr = [];
var dailyItemArr = [];

class ItemConstructor {
    constructor(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote) {
        this.iID = hashLib.itemHash(iName, iType, iColor, iPrice, iCertification, iEdition)
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

featuredItemParser = async () => {
    for (var x = 1; x <= 2; x++) {
        var CurrFeat = $(".rlg-item-shop__featured > a:nth-child(" + x + ")").html()
        if (CurrFeat == null || CurrFeat == undefined) {
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
        var iUpvote = CurrCheer("button.rlg-item-shop__item-vote.--up > span").text().trim();
        var iDownvote = CurrCheer("button.rlg-item-shop__item-vote.--down > span").text().trim();
        featuredItemArr.push(new ItemConstructor(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote))
    }
    return;
}

dailyItemParser = async () => {
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
        var iUpvote = CurrCheer("button.rlg-item-shop__item-vote.--up > span").text().trim();
        var iDownvote = CurrCheer("button.rlg-item-shop__item-vote.--down > span").text().trim();
        dailyItemArr.push(new ItemConstructor(iName, iType, iColor, iCertification, iEdition, iPrice, iUpvote, iDownvote))
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