const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd , commands } = require('../command');

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

// Auto Typing Feature (Composing)
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner, sender }) => {
    try {
        if (config.AUTO_TYPING === 'true' || config.AUTO_TYPING === true) {
            await conn.sendPresenceUpdate('composing', from); // send typing indicator
        }
    } catch (error) {
        console.error("❌ Auto Typing Error:", error);
    }
});

// Auto Typing Command to Toggle
cmd({
    pattern: "autotyping",
    alias: ["autotype", "typing"],
    desc: "Toggle auto typing feature",
    category: "settings",
    react: "✍️",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, isOwner, reply }) => {
    try {
        // Owner-only access
        if (!isOwner) {
            return await conn.sendMessage(from, { 
                text: "🚫 *𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚝𝚘 𝚝𝚑𝚎 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛.*\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const action = args[0]?.toLowerCase();
        let statusText = "";
        let reaction = "✍️";

        if (action === "on" || action === "enable") {
            config.AUTO_TYPING = true;
            statusText = "✅ *𝙰𝚞𝚝𝚘 𝚃𝚢𝚙𝚒𝚗𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝙴𝙽𝙰𝙱𝙻𝙴𝙳*";
            reaction = "✅";
        } 
        else if (action === "off" || action === "disable") {
            config.AUTO_TYPING = false;
            statusText = "❌ *𝙰𝚞𝚝𝚘 𝚃𝚢𝚙𝚒𝚗𝚐 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝙳𝙸𝚂𝙰𝙱𝙻𝙴𝙳*";
            reaction = "❌";
        } 
        else {
            // Show current status
            const currentStatus = (config.AUTO_TYPING === 'true' || config.AUTO_TYPING === true) ? "𝙴𝚗𝚊𝚋𝚕𝚎𝚍 ✅" : "𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍 ❌";
            
            return await conn.sendMessage(from, { 
                text: `📊 *𝙰𝚞𝚝𝚘 𝚃𝚢𝚙𝚒𝚗𝚐 𝚂𝚝𝚊𝚝𝚞𝚜*\n\n` +
                      `• 𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝚂𝚝𝚊𝚝𝚞𝚜: ${currentStatus}\n\n` +
                      `*𝚄𝚜𝚊𝚐𝚎:*\n` +
                      `• .autotyping on  - 𝙴𝚗𝚊𝚋𝚕𝚎 𝚊𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐\n` +
                      `• .autotyping off - 𝙳𝚒𝚜𝚊𝚋𝚕𝚎 𝚊𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐\n\n` +
                      `> © Powered by Sila Tech`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Send status message
        await conn.sendMessage(from, { 
            text: `${statusText}\n\n> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        // React to original command
        await conn.sendMessage(from, {
            react: { text: reaction, key: mek.key }
        });

    } catch (error) {
        console.error("❌ Auto Typing Command Error:", error);
        await conn.sendMessage(from, { 
            text: `⚠️ 𝙴𝚛𝚛𝚘𝚛: ${error.message}\n\n> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});