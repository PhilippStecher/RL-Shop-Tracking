const webhookLib = require('./webhook');

module.exports.log = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    var message = `[LOG] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendLog(message);

    if (callback) callback();
}

module.exports.warn = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    var message = `[WARN] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendWarn(message);

    if (callback) callback();
}

module.exports.error = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    var message = `[ERROR] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendError(message);

    if (callback) callback();
}

module.exports.info = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    var message = `[INFO] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendInfo(message);

    if (callback) callback();
}