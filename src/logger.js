const webhookLib = require('./webhook');
const isLoggingActive = true;

module.exports.log = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    if (!isLoggingActive) return;

    var message = `[LOG] <`;


    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendLog(file, uniquePositions, msg);

    if (callback) callback();
}

module.exports.warn = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    if (!isLoggingActive) return;
    
    var message = `[WARN] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendWarn(file, uniquePositions, msg);

    if (callback) callback();
}

module.exports.error = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    if (!isLoggingActive) return;
    
    var message = `[ERROR] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendError(file, uniquePositions, msg);

    if (callback) callback();
}

module.exports.info = (msg, file = null, uniquePositions = null, webhook = true, callback = null) => {
    if (!isLoggingActive) return;
    
    var message = `[INFO] <`;

    if (file)
        message += file;


    if (uniquePositions)
        message += ` | ${uniquePositions}`;

    message += `>: ${msg};`;

    console.log(message);

    if (webhook) webhookLib.sendInfo(file, uniquePositions, msg);

    if (callback) callback();
}