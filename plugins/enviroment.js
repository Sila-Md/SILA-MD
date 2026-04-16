//---------------------------------------------------------------------------
//           𝚂𝙸𝙻𝙰 𝙼𝙳
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

//=============================================
//  𝙰𝙳𝙼𝙸𝙽 𝙴𝚅𝙴𝙽𝚃𝚂
//=============================================
cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚍𝚖𝚒𝚗 𝚎𝚟𝚎𝚗𝚝 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗𝚜 𝚊𝚛𝚎 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚍𝚖𝚒𝚗 𝚎𝚟𝚎𝚗𝚝 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗𝚜 𝚊𝚛𝚎 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.ADMIN_EVENTS === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 ⚙️ *𝙰𝙳𝙼𝙸𝙽 𝙴𝚅𝙴𝙽𝚃𝚂* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .admin-events on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .admin-events off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝚆𝙴𝙻𝙲𝙾𝙼𝙴
//=============================================
cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚊𝚛𝚎 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (status === "off") {
        config.WELCOME = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚊𝚛𝚎 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.WELCOME === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 👋 *𝚆𝙴𝙻𝙲𝙾𝙼𝙴* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .welcome on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .welcome off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝚂𝙴𝚃 𝙿𝚁𝙴𝙵𝙸𝚇
//=============================================
cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const newPrefix = args[0];
    if (!newPrefix) {
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🔧 *𝚂𝙴𝚃 𝙿𝚁𝙴𝙵𝙸𝚇* 〕━━┈⊷
┃
┃ 📜 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝙿𝚛𝚎𝚏𝚒𝚡:* ${config.PREFIX}
┃
┃ *𝚄𝚜𝚊𝚐𝚎:* .setprefix [𝚗𝚎𝚠_𝚙𝚛𝚎𝚏𝚒𝚡]
┃ *𝙴𝚡𝚊𝚖𝚙𝚕𝚎:* .setprefix !
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    config.PREFIX = newPrefix;
    
    await conn.sendMessage(from, { 
        text: `✅ *𝙿𝚛𝚎𝚏𝚒𝚡 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚌𝚑𝚊𝚗𝚐𝚎𝚍 𝚝𝚘* *${newPrefix}*\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
});

//=============================================
//  𝚂𝙴𝚃 𝙼𝙾𝙳𝙴
//=============================================
cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (!args[0]) {
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🫟 *𝙱𝙾𝚃 𝙼𝙾𝙳𝙴* 〕━━┈⊷
┃
┃ 📌 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝙼𝚘𝚍𝚎:* *${config.MODE}*
┃
┃ *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .mode private
┃ ➸ .mode public
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const modeArg = args[0].toLowerCase();

    if (modeArg === "private") {
        config.MODE = "private";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙱𝚘𝚝 𝚖𝚘𝚍𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚜𝚎𝚝 𝚝𝚘* *𝙿𝚁𝙸𝚅𝙰𝚃𝙴*.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (modeArg === "public") {
        config.MODE = "public";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙱𝚘𝚝 𝚖𝚘𝚍𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚜𝚎𝚝 𝚝𝚘* *𝙿𝚄𝙱𝙻𝙸𝙲*.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        return await conn.sendMessage(from, { 
            text: "❌ *𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚖𝚘𝚍𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚞𝚜𝚎* `.mode private` *𝚘𝚛* `.mode public`.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾-𝚃𝚈𝙿𝙸𝙽𝙶
//=============================================
cmd({
    pattern: "auto-typing",
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_TYPING = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙽.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (status === "off") {
        config.AUTO_TYPING = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙵𝙵.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_TYPING === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 ✍️ *𝙰𝚄𝚃𝙾-𝚃𝚈𝙿𝙸𝙽𝙶* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .auto-typing on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .auto-typing off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙼𝙴𝙽𝚃𝙸𝙾𝙽 𝚁𝙴𝙿𝙻𝚈
//=============================================
cmd({
    pattern: "mention-reply",
    alias: ["menetionreply", "mee"],
    description: "Enable or disable mention reply feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const status = args[0]?.toLowerCase();
    
    if (args[0] === "on") {
        config.MENTION_REPLY = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙼𝚎𝚗𝚝𝚒𝚘𝚗 𝚁𝚎𝚙𝚕𝚢 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.MENTION_REPLY = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙼𝚎𝚗𝚝𝚒𝚘𝚗 𝚁𝚎𝚙𝚕𝚢 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.MENTION_REPLY === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 👥 *𝙼𝙴𝙽𝚃𝙸𝙾𝙽 𝚁𝙴𝙿𝙻𝚈* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .mee on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .mee off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴
//=============================================
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚕𝚠𝚊𝚢𝚜 𝚘𝚗𝚕𝚒𝚗𝚎 𝚖𝚘𝚍𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚕𝚠𝚊𝚢𝚜 𝚘𝚗𝚕𝚒𝚗𝚎 𝚖𝚘𝚍𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.ALWAYS_ONLINE === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🌐 *𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .always-online on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .always-online off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳𝙸𝙽𝙶
//=============================================
cmd({
    pattern: "auto-recording",
    alias: ["autorecoding"],
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_RECORDING = "true";
        await conn.sendPresenceUpdate("recording", from);
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍. 𝙱𝚘𝚝 𝚒𝚜 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐...*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (status === "off") {
        config.AUTO_RECORDING = "false";
        await conn.sendPresenceUpdate("available", from);
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_RECORDING === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🎙️ *𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳𝙸𝙽𝙶* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .auto-recording on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .auto-recording off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾 𝚂𝙴𝙴𝙽 (𝚂𝚃𝙰𝚃𝚄𝚂)
//=============================================
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘-𝚟𝚒𝚎𝚠𝚒𝚗𝚐 𝚘𝚏 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘-𝚟𝚒𝚎𝚠𝚒𝚗𝚐 𝚘𝚏 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_STATUS_SEEN === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 👀 *𝙰𝚄𝚃𝙾 𝚂𝙴𝙴𝙽* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .auto-seen on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .auto-seen off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝚂𝚃𝙰𝚃𝚄𝚂 𝚁𝙴𝙰𝙲𝚃
//=============================================
cmd({
    pattern: "status-react",
    alias: ["statusreaction"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘-𝚕𝚒𝚔𝚒𝚗𝚐 𝚘𝚏 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘-𝚕𝚒𝚔𝚒𝚗𝚐 𝚘𝚏 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_STATUS_REACT === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 ❤️ *𝚂𝚃𝙰𝚃𝚄𝚂 𝚁𝙴𝙰𝙲𝚃* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .status-react on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .status-react off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝚁𝙴𝙰𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴
//=============================================
cmd({
    pattern: "read-message",
    alias: ["autoread"],
    desc: "enable or disable readmessage.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝚁𝚎𝚊𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝚁𝚎𝚊𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.READ_MESSAGE === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 📖 *𝚁𝙴𝙰𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .read-message on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .read-message off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝙽𝚃𝙸-𝙱𝙰𝙳
//=============================================
cmd({
    pattern: "anti-bad",
    alias: ["antibadword"],
    desc: "enable or disable antibad.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.ANTI_BAD_WORD = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚗𝚝𝚒 𝚋𝚊𝚍 𝚠𝚘𝚛𝚍 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.ANTI_BAD_WORD = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚗𝚝𝚒 𝚋𝚊𝚍 𝚠𝚘𝚛𝚍 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.ANTI_BAD_WORD === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🚫 *𝙰𝙽𝚃𝙸-𝙱𝙰𝙳* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .anti-bad on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .anti-bad off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾-𝚂𝚃𝙸𝙲𝙺𝙴𝚁
//=============================================
cmd({
    pattern: "auto-sticker",
    alias: ["autosticker"],
    desc: "enable or disable auto-sticker.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.AUTO_STICKER = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘-𝚜𝚝𝚒𝚌𝚔𝚎𝚛 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.AUTO_STICKER = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘-𝚜𝚝𝚒𝚌𝚔𝚎𝚛 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_STICKER === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🎨 *𝙰𝚄𝚃𝙾-𝚂𝚃𝙸𝙲𝙺𝙴𝚁* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .auto-sticker on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .auto-sticker off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾-𝚁𝙴𝙿𝙻𝚈
//=============================================
cmd({
    pattern: "auto-reply",
    alias: ["autoreply"],
    desc: "enable or disable auto-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.AUTO_REPLY = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘-𝚛𝚎𝚙𝚕𝚢 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.AUTO_REPLY = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘-𝚛𝚎𝚙𝚕𝚢 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_REPLY === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 🤖 *𝙰𝚄𝚃𝙾-𝚁𝙴𝙿𝙻𝚈* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .auto-reply on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .auto-reply off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾-𝚁𝙴𝙰𝙲𝚃
//=============================================
cmd({
    pattern: "auto-react1",
    alias: ["autoreact1"],
    desc: "Enable or disable the autoreact feature",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.AUTO_REACT = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝚞𝚝𝚘𝚛𝚎𝚊𝚌𝚝 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.AUTO_REACT = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝚞𝚝𝚘𝚛𝚎𝚊𝚌𝚝 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_REACT === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 ❤️ *𝙰𝚄𝚃𝙾-𝚁𝙴𝙰𝙲𝚃* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .auto-react1 on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .auto-react1 off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝚂𝚃𝙰𝚃𝚄𝚂-𝚁𝙴𝙿𝙻𝚈
//=============================================
cmd({
    pattern: "status-reply",
    alias: ["autostatusreply"],
    desc: "enable or disable status-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_REPLY = "true";
        return await conn.sendMessage(from, { 
            text: "✅ *𝚂𝚝𝚊𝚝𝚞𝚜-𝚛𝚎𝚙𝚕𝚢 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REPLY = "false";
        return await conn.sendMessage(from, { 
            text: "❌ *𝚂𝚝𝚊𝚝𝚞𝚜-𝚛𝚎𝚙𝚕𝚢 𝚏𝚎𝚊𝚝𝚞𝚛𝚎 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const currentStatus = config.AUTO_STATUS_REPLY === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
        return await conn.sendMessage(from, { 
            text: `╭━━〔 💬 *𝚂𝚃𝙰𝚃𝚄𝚂-𝚁𝙴𝙿𝙻𝚈* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .status-reply on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .status-reply off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

//=============================================
//  𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺
//=============================================
cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "group",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply, from, sender }) => {
  try {
    if (!isGroup) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚊 𝚐𝚛𝚘𝚞𝚙.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    if (!isBotAdmins) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝙱𝚘𝚝 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    if (!isAdmins) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝙽𝚃𝙸_𝙻𝙸𝙽𝙺 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝙽𝚃𝙸_𝙻𝙸𝙽𝙺 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
      const currentStatus = config.ANTI_LINK === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
      return await conn.sendMessage(from, { 
            text: `╭━━〔 🚫 *𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .antilink on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .antilink off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
  } catch (e) {
    await conn.sendMessage(from, { 
        text: `❌ 𝙴𝚛𝚛𝚘𝚛: ${e.message}\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});

//=============================================
//  𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝙺𝙸𝙲𝙺
//=============================================
cmd({
  pattern: "antilinkkick",
  alias: ["kicklink"],
  desc: "Enable or disable ANTI_LINK_KICK in groups",
  category: "group",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply, from, sender }) => {
  try {
    if (!isGroup) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚊 𝚐𝚛𝚘𝚞𝚙.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    if (!isBotAdmins) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝙱𝚘𝚝 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    if (!isAdmins) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      return await conn.sendMessage(from, { 
            text: "✅ *𝙰𝙽𝚃𝙸_𝙻𝙸𝙽𝙺_𝙺𝙸𝙲𝙺 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      return await conn.sendMessage(from, { 
            text: "❌ *𝙰𝙽𝚃𝙸_𝙻𝙸𝙽𝙺_𝙺𝙸𝙲𝙺 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
      const currentStatus = config.ANTI_LINK_KICK === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
      return await conn.sendMessage(from, { 
            text: `╭━━〔 ⚠️ *𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝙺𝙸𝙲𝙺* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .antilinkkick on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .antilinkkick off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
  } catch (e) {
    await conn.sendMessage(from, { 
        text: `❌ 𝙴𝚛𝚛𝚘𝚛: ${e.message}\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});

//=============================================
//  𝙳𝙴𝙻𝙴𝚃𝙴 𝙻𝙸𝙽𝙺𝚂
//=============================================
cmd({
  pattern: "deletelink",
  alias: ["linksdelete"],
  desc: "Enable or disable DELETE_LINKS in groups",
  category: "group",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply, from, sender }) => {
  try {
    if (!isGroup) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚊 𝚐𝚛𝚘𝚞𝚙.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    if (!isBotAdmins) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝙱𝚘𝚝 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    if (!isAdmins) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚗 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    if (args[0] === "on") {
      config.DELETE_LINKS = "true";
      return await conn.sendMessage(from, { 
            text: "✅ *𝙳𝙴𝙻𝙴𝚃𝙴_𝙻𝙸𝙽𝙺𝚂 𝚒𝚜 𝚗𝚘𝚠 𝚎𝚗𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === "off") {
      config.DELETE_LINKS = "false";
      return await conn.sendMessage(from, { 
            text: "❌ *𝙳𝙴𝙻𝙴𝚃𝙴_𝙻𝙸𝙽𝙺𝚂 𝚒𝚜 𝚗𝚘𝚠 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
      const currentStatus = config.DELETE_LINKS === "true" ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
      return await conn.sendMessage(from, { 
            text: `╭━━〔 ❌ *𝙳𝙴𝙻𝙴𝚃𝙴 𝙻𝙸𝙽𝙺𝚂* 〕━━┈⊷
┃
┃ 📜 *𝚄𝚜𝚊𝚐𝚎:*
┃ ➸ .deletelink on  - 𝙴𝚗𝚊𝚋𝚕𝚎
┃ ➸ .deletelink off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎
┃
┃ 💡 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝:* ${currentStatus}
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
  } catch (e) {
    await conn.sendMessage(from, { 
        text: `❌ 𝙴𝚛𝚛𝚘𝚛: ${e.message}\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});