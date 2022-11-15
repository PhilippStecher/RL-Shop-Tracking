const metaData = require('../src/meta');

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