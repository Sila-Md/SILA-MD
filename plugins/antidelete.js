// 🌟 AntiDelete Command — Stylish Edition (Functionality Unchanged)
const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const {
    getAnti,
    setAnti,
    initializeAntiDeleteSettings
} = require('../data/antidel');

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
        },
    };
};

// 🔁 Ensure AntiDelete settings exist on startup
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ["antidel", "ad"],
    desc: "Configure AntiDelete settings",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe, sender }) => {

    // 🔐 Owner-only access
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    try {
        const command = q?.toLowerCase();

        switch (command) {

            // 🔴 Turn OFF AntiDelete everywhere
            case "on":
                await setAnti("gc", false);
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: "❌ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍*\n\n_𝙶𝚛𝚘𝚞𝚙 𝙲𝚑𝚊𝚝𝚜 & 𝙳𝚒𝚛𝚎𝚌𝚝 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚊𝚛𝚎 𝚗𝚘𝚠 𝙾𝙵𝙵._\n\n> © Powered by Sila Tech", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔕 Disable AntiDelete for Group Chats
            case "off gc":
                await setAnti("gc", false);
                return await conn.sendMessage(from, { 
                    text: "❌ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚏𝚘𝚛 𝙶𝚛𝚘𝚞𝚙 𝙲𝚑𝚊𝚝𝚜 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔕 Disable AntiDelete for DMs
            case "off dm":
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: "❌ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚏𝚘𝚛 𝙳𝚒𝚛𝚎𝚌𝚝 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚒𝚜𝚊𝚋𝚕𝚎𝚍.*\n\n> © Powered by Sila Tech", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔁 Toggle Group Chat AntiDelete
            case "set gc": {
                const gcStatus = await getAnti("gc");
                await setAnti("gc", !gcStatus);
                return await conn.sendMessage(from, { 
                    text: `🔄 *𝙶𝚛𝚘𝚞𝚙 𝙲𝚑𝚊𝚝 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎* 𝚒𝚜 𝚗𝚘𝚠 *${!gcStatus ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌"}*\n\n> © Powered by Sila Tech`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // 🔁 Toggle DM AntiDelete
            case "set dm": {
                const dmStatus = await getAnti("dm");
                await setAnti("dm", !dmStatus);
                return await conn.sendMessage(from, { 
                    text: `🔄 *𝙳𝙼 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎* 𝚒𝚜 𝚗𝚘𝚠 *${!dmStatus ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌"}*\n\n> © Powered by Sila Tech`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // ✅ Enable AntiDelete everywhere
            case "set all":
                await setAnti("gc", true);
                await setAnti("dm", true);
                return await conn.sendMessage(from, { 
                    text: "✅ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚎𝚗𝚊𝚋𝚕𝚎𝚍 𝚏𝚘𝚛 𝙰𝙻𝙻 𝚌𝚑𝚊𝚝𝚜.*\n\n> © Powered by Sila Tech", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 📊 Show current status
            case "status": {
                const currentDmStatus = await getAnti("dm");
                const currentGcStatus = await getAnti("gc");

                return await conn.sendMessage(from, { 
                    text: "📊 *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚂𝚝𝚊𝚝𝚞𝚜*\n\n" +
                          `• *𝙳𝚒𝚛𝚎𝚌𝚝 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜:* ${currentDmStatus ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌"}\n` +
                          `• *𝙶𝚛𝚘𝚞𝚙 𝙲𝚑𝚊𝚝𝚜:* ${currentGcStatus ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌"}\n\n` +
                          "> © Powered by Sila Tech", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // 📖 Help Menu
            default:
                return await conn.sendMessage(from, { 
                    text: "📖 *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙶𝚞𝚒𝚍𝚎*\n\n" +
                          "• `.antidelete on` — 𝙳𝚒𝚜𝚊𝚋𝚕𝚎 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚌𝚑𝚊𝚝𝚜\n" +
                          "• `.antidelete off gc` — 𝙳𝚒𝚜𝚊𝚋𝚕𝚎 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚒𝚗 𝙶𝚛𝚘𝚞𝚙 𝙲𝚑𝚊𝚝𝚜\n" +
                          "• `.antidelete off dm` — 𝙳𝚒𝚜𝚊𝚋𝚕𝚎 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚒𝚗 𝙳𝚒𝚛𝚎𝚌𝚝 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜\n" +
                          "• `.antidelete set gc` — 𝚃𝚘𝚐𝚐𝚕𝚎 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚏𝚘𝚛 𝙶𝚛𝚘𝚞𝚙 𝙲𝚑𝚊𝚝𝚜\n" +
                          "• `.antidelete set dm` — 𝚃𝚘𝚐𝚐𝚕𝚎 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚏𝚘𝚛 𝙳𝚒𝚛𝚎𝚌𝚝 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜\n" +
                          "• `.antidelete set all` — 𝙴𝚗𝚊𝚋𝚕𝚎 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚎𝚟𝚎𝚛𝚢𝚠𝚑𝚎𝚛𝚎\n" +
                          "• `.antidelete status` — 𝚅𝚒𝚎𝚠 𝚌𝚞𝚛𝚛𝚎𝚗𝚝 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚜𝚝𝚊𝚝𝚞𝚜\n\n" +
                          "> © Powered by Sila Tech", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
        }

    } catch (error) {
        console.error("❌ AntiDelete Command Error:", error);
        return await conn.sendMessage(from, { 
            text: "⚠️ *𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚛𝚎𝚚𝚞𝚎𝚜𝚝.*\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});