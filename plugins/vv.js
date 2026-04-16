const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

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

cmd({
    pattern: "vv",
    alias: ["viewonce", "reveal"],
    desc: "Reveal view-once image or video",
    category: "tools",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝚁𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 *𝚟𝚒𝚎𝚠-𝚘𝚗𝚌𝚎 𝚒𝚖𝚊𝚐𝚎 𝚘𝚛 𝚟𝚒𝚍𝚎𝚘*.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Handle view-once wrapper
        const viewOnceMsg = quoted.viewOnceMessageV2 || quoted.viewOnceMessage || null;

        const mediaMessage = viewOnceMsg?.message?.imageMessage ||
            viewOnceMsg?.message?.videoMessage ||
            quoted.imageMessage ||
            quoted.videoMessage;

        if (!mediaMessage) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝚄𝚗𝚜𝚞𝚙𝚙𝚘𝚛𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚢𝚙𝚎.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const isImage = !!mediaMessage.imageMessage || mediaMessage.mimetype?.startsWith("image");
        const isVideo = !!mediaMessage.videoMessage || mediaMessage.mimetype?.startsWith("video");

        if (!mediaMessage.viewOnce) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝚃𝚑𝚒𝚜 𝚒𝚜 𝚗𝚘𝚝 𝚊 𝚟𝚒𝚎𝚠-𝚘𝚗𝚌𝚎 𝚖𝚎𝚍𝚒𝚊.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Ping-style reaction
        const reactionEmojis = ['🔥','⚡','🚀','💨','🎯','🎉','🌟','💥','👁️'];
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        await conn.sendMessage(from, {
            react: { text: reactEmoji, key: mek.key }
        });

        // Download media
        const stream = await downloadContentFromMessage(
            mediaMessage,
            isImage ? "image" : "video"
        );

        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Send revealed media (NOT view-once)
        await conn.sendMessage(from, {
            [isImage ? "image" : "video"]: buffer,
            caption: mediaMessage.caption || '',
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (err) {
        console.error("VV Command Error:", err);
        await conn.sendMessage(from, { 
            text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚟𝚎𝚊𝚕 𝚟𝚒𝚎𝚠-𝚘𝚗𝚌𝚎 𝚖𝚎𝚍𝚒𝚊.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});