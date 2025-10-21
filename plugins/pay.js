const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "mpesamenu",
    alias: ["pesa"],
    desc: "menu the bot",
    category: "menu",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `*╭───❍SUPPORT🥹🫡❍*
‎*├⬡ .HALOPESA +255612491554* 
‎*├⬡ .AIRTEL MONEY +255789661034*
‎*╰───────────────❍*`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/r3z0ux.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: 'https://whatsapp.com/channel/0029VbAffhD2ZjChG9DX922r',
                        newsletterName: "SILATRIX-MD PAYMENT",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
