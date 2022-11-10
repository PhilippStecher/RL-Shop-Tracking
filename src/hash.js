var pbkdf2 = require('pbkdf2');
var crypto = require('crypto');

var defaultSalt = 'RlShopTracker';
var pepper = 'ThisIsPepper';

module.exports.itemHash = (iName, iType, iColor, iPrice, iCertification, iEdition) => {
    var password = iName + iType + pepper +  iColor + iPrice + iCertification + iEdition;
    var hash = pbkdf2.pbkdf2Sync(password, defaultSalt, 2, 64, 'sha512').toString('hex');
    return hash;
}

module.exports.uniqueDayhash = (obj) => {
    for (var x = 0; x < obj.length; x++) {
        delete obj[x].iUpvote;
        delete obj[x].iDownvote;
        delete obj[x].pulltimeCode;
        delete obj[x].pulltimeText;
    }
    var md5 = crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
    return md5;
}