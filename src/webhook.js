var https = require('follow-redirects').https;
const isWebhookActive = true;

send = (payload) => {
    if (!isWebhookActive) return;
    
    const webhookUrl = '/api/webhooks/1040575138594308096/1Itajq7zOdxRmMDAG_tfkHgP1GzTkAKaNLlKN83PGZzpfFWEz3HGcjoPGltF9Wpk_Ldl';

    var options = {
        hostname: 'discord.com',
        path: webhookUrl,
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
            'Accept': '/',
            'Content-Type': 'application/json; charset=utf-8',
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    req.write(JSON.stringify(payload));
    req.end();
}

module.exports.sendLog = (file, id, message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Log",
                "color": 840145,
                "fields": [
                    {
                        "name": "File",
                        "value": file,
                        "inline": true
                    },
                    {
                        "name": "Unique Identifier",
                        "value": id,
                        "inline": true
                    },
                    {
                        "name": "Message",
                        "value": message
                    }
                ],
                "author": {
                    "name": "RL-Shop-Tracking",
                    "url": "https://github.com/PhilippStecher/RL-Shop-Tracking",
                    "icon_url": "https://avatars.githubusercontent.com/u/55993320?v=4"
                },
                "footer": {
                    "text": "System Message"
                },
                "timestamp": new Date().toISOString()
            }
        ],
        "attachments": []
    }
    send(payload);
}

module.exports.sendInfo = (file, id, message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Info",
                "color": 4718336,
                "fields": [
                    {
                        "name": "File",
                        "value": file,
                        "inline": true
                    },
                    {
                        "name": "Unique Identifier",
                        "value": id,
                        "inline": true
                    },
                    {
                        "name": "Message",
                        "value": message
                    }
                ],
                "author": {
                    "name": "RL-Shop-Tracking",
                    "url": "https://github.com/PhilippStecher/RL-Shop-Tracking",
                    "icon_url": "https://avatars.githubusercontent.com/u/55993320?v=4"
                },
                "footer": {
                    "text": "System Message"
                },
                "timestamp": new Date().toISOString()
            }
        ],
        "attachments": []
    }
    send(payload);
}

module.exports.sendWarn = (file, id, message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Warn",
                "color": 16763904,
                "fields": [
                    {
                        "name": "File",
                        "value": file,
                        "inline": true
                    },
                    {
                        "name": "Unique Identifier",
                        "value": id,
                        "inline": true
                    },
                    {
                        "name": "Message",
                        "value": message
                    }
                ],
                "author": {
                    "name": "RL-Shop-Tracking",
                    "url": "https://github.com/PhilippStecher/RL-Shop-Tracking",
                    "icon_url": "https://avatars.githubusercontent.com/u/55993320?v=4"
                },
                "footer": {
                    "text": "System Message"
                },
                "timestamp": new Date().toISOString()
            }
        ],
        "attachments": []
    }
    send(payload);
}

module.exports.sendError = (file, id, message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Error",
                "color": 16711680,
                "fields": [
                    {
                        "name": "File",
                        "value": file,
                        "inline": true
                    },
                    {
                        "name": "Unique Identifier",
                        "value": id,
                        "inline": true
                    },
                    {
                        "name": "Message",
                        "value": message
                    }
                ],
                "author": {
                    "name": "RL-Shop-Tracking",
                    "url": "https://github.com/PhilippStecher/RL-Shop-Tracking",
                    "icon_url": "https://avatars.githubusercontent.com/u/55993320?v=4"
                },
                "footer": {
                    "text": "System Message"
                },
                "timestamp": new Date().toISOString()
            }
        ],
        "attachments": []
    }
    send(payload);
}