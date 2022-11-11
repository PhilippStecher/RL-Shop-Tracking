var https = require('follow-redirects').https;

send = (payload) => {
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

module.exports.sendLog = (message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Log",
                "description": message,
                "color": 840145,
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

module.exports.sendInfo = (message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Info",
                "description": message,
                "color": 4718336,
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

module.exports.sendWarn = (message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Warn",
                "description": message,
                "color": 16763904,
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

module.exports.sendError = (message) => {
    const payload = {
        "content": "<@344389859378724866>",
        "embeds": [
            {
                "title": "Error",
                "description": message,
                "color": 16711680,
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