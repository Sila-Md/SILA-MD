const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path za settings
const SETTINGS_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'botsettings.json');
const ANTICALL_FILE = path.join(SETTINGS_DIR, 'anticall.json');

// Hakikisha folder ipo
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// Default settings
const DEFAULT_SETTINGS = {
    // Owner settings
    ownerName: 'Sila Tech',
    ownerNumber: '255789661031',
    
    // Sticker settings
    stickerAuthor: 'Sila MD',
    stickerPackName: 'Sila Stickers',
    
    // Watermark settings
    watermark: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
    
    // Timezone settings
    timezone: 'Africa/Dar_es_Salaam',
    
    // Bot settings
    botName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
    botVersion: '1.0.0',
    
    // Menu settings
    menuImage: 'https://files.catbox.moe/36vahk.png',
    
    // Message settings
    welcomeMessage: 'Welcome to the group!',
    goodbyeMessage: 'Goodbye!',
    
    // Feature settings
    antiLink: false,
    antiBadWord: false,
    autoBlock: false
};

// Default anticall settings
const DEFAULT_ANTICALL = {
    enabled: false,
    message: "📵 *Anti-Call Activated*\n\nBot does not accept calls. Please use text messages only.\n\n> 𝐒𝐈𝐋𝐀 𝐌𝐃",
    action: "reject", // reject, block, ignore
    logCalls: true,
    allowedContacts: []
};

// ============ FUNCTIONS ============

// Function ya kusoma settings
function readSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.log('Error reading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

// Function ya kuandika settings
function writeSettings(data) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing settings:', error);
        return false;
    }
}

// Function ya kusoma anticall settings
function readAntiCall() {
    try {
        if (fs.existsSync(ANTICALL_FILE)) {
            const data = fs.readFileSync(ANTICALL_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_ANTICALL;
    } catch (error) {
        console.log('Error reading anticall:', error);
        return DEFAULT_ANTICALL;
    }
}

// Function ya kuandika anticall settings
function writeAntiCall(data) {
    try {
        fs.writeFileSync(ANTICALL_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing anticall:', error);
        return false;
    }
}

// Function ya kureset settings
function resetSettings() {
    return writeSettings(DEFAULT_SETTINGS);
}

// Function ya kureset anticall
function resetAntiCall() {
    return writeAntiCall(DEFAULT_ANTICALL);
}

// Function ya kupata all settings
async function getAllSettings() {
    const settings = readSettings();
    const anticall = readAntiCall();
    return { ...settings, anticall };
}

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐒𝐈𝐋𝐀 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============ 1. SET MENU IMAGE ============
cmd({
    pattern: "setmenuimage",
    alias: ["menupic", "menuimage", "setmenupic"],
    react: "🖼️",
    desc: "Set menu image URL or upload image",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, quoted, reply}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let settings = readSettings();
    let imageUrl = settings.menuImage;
    
    // Case 1: Reply to an image
    if (m.quoted && (m.quoted.message?.imageMessage || m.quoted.message?.videoMessage)) {
        try {
            await conn.sendMessage(from, {
                text: `⏳ Downloading image...`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            
            // Download the image
            const media = await conn.downloadAndSaveMediaMessage(m.quoted);
            
            // Upload to temporary hosting (you can use your own upload function)
            // For now, we'll use a local path or upload to a service
            const imageBuffer = fs.readFileSync(media);
            
            // Option 1: Save locally
            const localPath = path.join(SETTINGS_DIR, 'menu_image.jpg');
            fs.writeFileSync(localPath, imageBuffer);
            settings.menuImage = 'local'; // Special flag for local image
            writeSettings(settings);
            
            fs.unlinkSync(media); // Delete temp file
            
            await conn.sendMessage(from, {
                text: `┏━❑ MENU IMAGE UPDATED ━━━━━━━━━
┃ ✅ Menu image set successfully
┃ 📁 Using local image
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            
            return;
        } catch (downloadError) {
            console.log('Download error:', downloadError);
            // Fall back to URL method
        }
    }
    
    // Case 2: Provide URL
    if (args[0]) {
        imageUrl = args[0];
        
        // Validate URL (basic check)
        if (!imageUrl.startsWith('http')) {
            return await conn.sendMessage(from, {
                text: `❌ Please provide a valid URL starting with http:// or https://\n\nOr reply to an image with .setmenuimage`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
        
        settings.menuImage = imageUrl;
        writeSettings(settings);
        
        // Test the URL
        try {
            await axios.head(imageUrl);
        } catch (e) {
            // URL might be valid even if head fails
        }
        
        await conn.sendMessage(from, {
            text: `┏━❑ MENU IMAGE UPDATED ━━━━━━━━━
┃ ✅ Menu image URL set
┃ 🔗 ${imageUrl}
┃ 
┃ *Preview:* Use .menu to see
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
        return;
    }
    
    // No arguments and not replying to image
    await conn.sendMessage(from, {
        text: `┏━❑ SET MENU IMAGE ━━━━━━━━━
┃ Current: ${settings.menuImage}
┃ 
┃ *Usage:*
┃ 1. Reply to image: .setmenuimage
┃ 2. With URL: .setmenuimage [url]
┃ 
┃ *Example:*
┃ .setmenuimage https://example.com/image.jpg
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('SETMENUIMAGE ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ 2. GET SETTINGS ============
cmd({
    pattern: "getsettings",
    alias: ["viewsettings", "allsettings", "mysettings"],
    react: "⚙️",
    desc: "View all bot settings",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, reply}) => {
try{
    if (!isOwner) return;
    
    const settings = readSettings();
    const anticall = readAntiCall();
    
    let settingsText = `┏━❑ BOT SETTINGS ━━━━━━━━━
┃ 
┃ 👑 *OWNER:*
┃ • Name: ${settings.ownerName}
┃ • Number: ${settings.ownerNumber}
┃ 
┃ 🤖 *BOT INFO:*
┃ • Name: ${settings.botName}
┃ • Version: ${settings.botVersion}
┃ • Timezone: ${settings.timezone}
┃ 
┃ 🖼️ *MENU:*
┃ • Image: ${settings.menuImage.substring(0, 50)}...
┃ 
┃ 💧 *WATERMARK:*
┃ • ${settings.watermark}
┃ 
┃ 🖼️ *STICKER:*
┃ • Author: ${settings.stickerAuthor}
┃ • Pack: ${settings.stickerPackName}
┃ 
┃ 📝 *MESSAGES:*
┃ • Welcome: ${settings.welcomeMessage}
┃ • Goodbye: ${settings.goodbyeMessage}
┃ 
┃ 📞 *ANTI-CALL:*
┃ • Enabled: ${anticall.enabled ? '✅' : '❌'}
┃ • Action: ${anticall.action}
┃ • Log: ${anticall.logCalls ? '✅' : '❌'}
┃ • Message: ${anticall.message.substring(0, 50)}...
┃ 
┃ 🛡️ *FEATURES:*
┃ • Anti Link: ${settings.antiLink ? '✅' : '❌'}
┃ • Anti Bad Word: ${settings.antiBadWord ? '✅' : '❌'}
┃ • Auto Block: ${settings.autoBlock ? '✅' : '❌'}
┃ 
┗━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(from, {
        text: settingsText,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 3. SET ANTICALL MESSAGE ============
cmd({
    pattern: "setanticallmsg",
    alias: ["anticallmsg", "setcallmsg"],
    react: "📵",
    desc: "Set anti-call message",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide anti-call message\n\nExample: .setanticallmsg Bot does not accept calls`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let anticall = readAntiCall();
    const oldMsg = anticall.message;
    const newMsg = args.join(' ');
    
    anticall.message = newMsg;
    writeAntiCall(anticall);
    
    await conn.sendMessage(from, {
        text: `┏━❑ ANTICALL MESSAGE UPDATED ━━━━━━━━━
┃ ✅ Message changed
┃ ┣ Old: ${oldMsg.substring(0, 50)}...
┃ ┗ New: ${newMsg.substring(0, 50)}...
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 4. SHOW ANTICALL MESSAGE ============
cmd({
    pattern: "showanticallmsg",
    alias: ["viewanticall", "anticallmsg"],
    react: "📋",
    desc: "Show current anti-call message",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, reply}) => {
try{
    if (!isOwner) return;
    
    let anticall = readAntiCall();
    
    await conn.sendMessage(from, {
        text: `┏━❑ ANTI-CALL MESSAGE ━━━━━━━━━
┃ 
┃ 📵 *Status:* ${anticall.enabled ? 'ENABLED' : 'DISABLED'}
┃ ⚙️ *Action:* ${anticall.action}
┃ 
┃ *Message:*
┃ ${anticall.message}
┃ 
┃ *Commands:*
┃ • .setanticallmsg [text] - Change message
┃ • .delanticallmsg - Delete/Reset message
┃ • .testanticallmsg - Test message
┃ • .anticall on/off - Toggle feature
┃ 
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 5. DELETE ANTICALL MESSAGE ============
cmd({
    pattern: "delanticallmsg",
    alias: ["resetanticall", "removeanticallmsg"],
    react: "🗑️",
    desc: "Reset anti-call message to default",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, reply}) => {
try{
    if (!isOwner) return;
    
    let anticall = readAntiCall();
    anticall.message = DEFAULT_ANTICALL.message;
    writeAntiCall(anticall);
    
    await conn.sendMessage(from, {
        text: `┏━❑ ANTICALL MESSAGE RESET ━━━━━━━━━
┃ ✅ Message reset to default
┃ 
┃ *Default:*
┃ ${DEFAULT_ANTICALL.message}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 6. TEST ANTICALL MESSAGE ============
cmd({
    pattern: "testanticallmsg",
    alias: ["testcallmsg", "tryanticall"],
    react: "🧪",
    desc: "Test anti-call message",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, reply}) => {
try{
    if (!isOwner) return;
    
    let anticall = readAntiCall();
    
    await conn.sendMessage(from, {
        text: `🧪 *ANTI-CALL TEST MESSAGE*
━━━━━━━━━━━━━━━━━━━━

${anticall.message}

━━━━━━━━━━━━━━━━━━━━
📝 *This is how the message will appear when someone calls*`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 7. TOGGLE ANTICALL ============
cmd({
    pattern: "anticall2",
    alias: ["toggleanticall", "setanticall"],
    react: "📵",
    desc: "Enable/disable anti-call feature",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    let anticall = readAntiCall();
    
    if (!args[0]) {
        // Toggle
        anticall.enabled = !anticall.enabled;
        await conn.sendMessage(from, {
            text: `✅ Anti-call: ${anticall.enabled ? 'ENABLED' : 'DISABLED'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === 'on' || args[0] === 'enable') {
        anticall.enabled = true;
        await conn.sendMessage(from, {
            text: `✅ Anti-call ENABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === 'off' || args[0] === 'disable') {
        anticall.enabled = false;
        await conn.sendMessage(from, {
            text: `✅ Anti-call DISABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === 'action') {
        if (args[1] === 'reject' || args[1] === 'block' || args[1] === 'ignore') {
            anticall.action = args[1];
            await conn.sendMessage(from, {
                text: `✅ Anti-call action set to: ${args[1]}`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        } else {
            return await conn.sendMessage(from, {
                text: `❌ Action must be: reject, block, or ignore`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    writeAntiCall(anticall);

} catch (e) {
    console.log(e);
}
});

// ============ 8. RESET SETTING ============
cmd({
    pattern: "resetsetting",
    alias: ["resetsettings", "resetall"],
    react: "🔄",
    desc: "Reset specific or all settings",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `┏━❑ RESET SETTINGS ━━━━━━━━━
┃ 
┃ *Usage:* .resetsetting [option]
┃ 
┃ *Options:*
┃ • all - Reset all settings
┃ • anticall - Reset anti-call
┃ • owner - Reset owner settings
┃ • sticker - Reset sticker settings
┃ • watermark - Reset watermark
┃ • menu - Reset menu image
┃ 
┃ *Examples:*
┃ .resetsetting all
┃ .resetsetting anticall
┃ .resetsetting owner
┃ 
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const option = args[0].toLowerCase();
    
    switch (option) {
        case 'all':
            resetSettings();
            resetAntiCall();
            await conn.sendMessage(from, {
                text: `✅ All settings reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        case 'anticall':
            resetAntiCall();
            await conn.sendMessage(from, {
                text: `✅ Anti-call settings reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        case 'owner':
            let settings = readSettings();
            settings.ownerName = DEFAULT_SETTINGS.ownerName;
            settings.ownerNumber = DEFAULT_SETTINGS.ownerNumber;
            writeSettings(settings);
            await conn.sendMessage(from, {
                text: `✅ Owner settings reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        case 'sticker':
            settings = readSettings();
            settings.stickerAuthor = DEFAULT_SETTINGS.stickerAuthor;
            settings.stickerPackName = DEFAULT_SETTINGS.stickerPackName;
            writeSettings(settings);
            await conn.sendMessage(from, {
                text: `✅ Sticker settings reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        case 'watermark':
            settings = readSettings();
            settings.watermark = DEFAULT_SETTINGS.watermark;
            writeSettings(settings);
            await conn.sendMessage(from, {
                text: `✅ Watermark reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        case 'menu':
            settings = readSettings();
            settings.menuImage = DEFAULT_SETTINGS.menuImage;
            writeSettings(settings);
            await conn.sendMessage(from, {
                text: `✅ Menu image reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        default:
            await conn.sendMessage(from, {
                text: `❌ Unknown option: ${option}`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
    }

} catch (e) {
    console.log(e);
}
});

// ============ 9. ANTICALL HANDLER (Middleware) ============
// Hii inashughulikia incoming calls
async function handleAntiCall(conn, update) {
    try {
        const anticall = readAntiCall();
        
        if (!anticall.enabled) return;
        
        // Check if it's a call
        if (update && update[0] && update[0].call) {
            const call = update[0].call;
            const caller = call.from;
            
            // Check if caller is in allowed contacts
            if (anticall.allowedContacts.includes(caller)) {
                return;
            }
            
            // Log the call
            if (anticall.logCalls) {
                console.log(`📞 Call from: ${caller} at ${new Date().toLocaleString()}`);
            }
            
            // Send message
            await conn.sendMessage(caller, {
                text: anticall.message
            });
            
            // Take action
            switch (anticall.action) {
                case 'reject':
                    await conn.rejectCall(call.id, call.from);
                    break;
                case 'block':
                    await conn.updateBlockStatus(caller, 'block');
                    break;
                case 'ignore':
                    // Do nothing
                    break;
            }
        }
    } catch (error) {
        console.log('Anti-call handler error:', error);
    }
}

// ============ EXPORT FUNCTIONS ============
module.exports = {
    // Settings functions
    readSettings,
    writeSettings,
    readAntiCall,
    writeAntiCall,
    getAllSettings,
    handleAntiCall,
    
    // Getter functions (for use in other files)
    getOwnerName: () => readSettings().ownerName,
    getOwnerNumber: () => readSettings().ownerNumber,
    getWatermark: () => readSettings().watermark,
    getStickerAuthor: () => readSettings().stickerAuthor,
    getStickerPack: () => readSettings().stickerPackName,
    getTimezone: () => readSettings().timezone,
    getMenuImage: () => readSettings().menuImage,
    getBotName: () => readSettings().botName,
    
    // Formatted time
    getFormattedTime: async (format = 'full') => {
        const settings = readSettings();
        const options = {
            timeZone: settings.timezone,
            hour12: true
        };
        
        if (format === 'full') {
            options.weekday = 'long';
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.second = '2-digit';
        } else if (format === 'date') {
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
        } else if (format === 'time') {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.second = '2-digit';
        }
        
        return new Date().toLocaleString('en-US', options);
    }
};
