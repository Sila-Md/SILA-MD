const { cmd } = require("../command");
const getFBInfo = require("@xaviabot/fb-downloader");
const config = require("../config");
const fs = require("fs");
const path = require("path");

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

const getContextInfo = (m, ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃", formattedOwnerNumber = "255789661031") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: ${ownerName}`,
            body: `📞 wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://files.catbox.moe/98k75b.jpeg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
    pattern: "fb",
    alias: ["facebook", "facebook1", "fb1"],
    desc: "Download Facebook videos/audios",
    category: "download",
    react: "📽️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        const ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃";
        const formattedOwnerNumber = "255789661031";
        const fbUrl = q && q.trim();
        
        if (!fbUrl) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚎𝚗𝚍 𝚊 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 𝚟𝚒𝚍𝚎𝚘 𝚕𝚒𝚗𝚔!\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }
        
        if (!fbUrl.includes("https://") || !fbUrl.includes("facebook.com")) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚎𝚗𝚍 𝚊 𝚟𝚊𝚕𝚒𝚍 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 𝚟𝚒𝚍𝚎𝚘 𝚕𝚒𝚗𝚔.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        const videoData = await getFBInfo(fbUrl);

        if (!videoData || !videoData.sd) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚟𝚒𝚍𝚎𝚘. 𝚃𝚑𝚎 𝚕𝚒𝚗𝚔 𝚖𝚒𝚐𝚑𝚝 𝚋𝚎 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚘𝚛 𝚒𝚗𝚟𝚊𝚕𝚒𝚍.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        const caption = `
╭━━〔 📽️ *𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* 〕━━┈⊷
┃
┃ *📌 𝚃𝙸𝚃𝙻𝙴:*  
┃ ${videoData.title || '𝙽𝚘 𝚝𝚒𝚝𝚕𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎'}
┃
┃ ━━━━━━━━━━━━━━━━
┃ *🎬 𝚁𝙴𝙿𝙻𝚈 𝚆𝙸𝚃𝙷 𝙽𝚄𝙼𝙱𝙴𝚁 𝙱𝙴𝙻𝙾𝚆*
┃ ━━━━━━━━━━━━━━━━
┃
┃ *📹 𝚅𝙸𝙳𝙴𝙾*
┃ ➊ 𝚂𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢
┃ ➋ 𝙷𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢
┃
┃ *🎵 𝙰𝚄𝙳𝙸𝙾*
┃ ➌ 𝙰𝚞𝚍𝚒𝚘 𝙾𝚗𝚕𝚢
┃ ➍ 𝙰𝚜 𝙳𝚘𝚌𝚞𝚖𝚎𝚗𝚝
┃ ➎ 𝙰𝚜 𝚅𝚘𝚒𝚌𝚎 𝙼𝚎𝚜𝚜𝚊𝚐𝚎
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech
`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoData.thumbnail || "https://files.catbox.moe/98k75b.jpeg" },
            caption,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });

        // Reply handler: listen for reply with option
        conn.ev.on("messages.upsert", async update => {
            try {
                const msg = update.messages[0];
                if (!msg.message?.extendedTextMessage) return;
                
                const text = msg.message.extendedTextMessage.text.trim();
                const quotedMsg = msg.message.extendedTextMessage.contextInfo?.stanzaId;
                
                if (quotedMsg === sentMsg.key.id) {
                    await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

                    switch (text) {
                        case "1":
                        case "➊":
                            await conn.sendMessage(from, {
                                video: { url: videoData.sd },
                                caption: `*𝚂𝙸𝙻𝙰 𝙼𝙳* - 𝚂𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢\n\n> © Powered by Sila Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        case "2":
                        case "➋":
                            if (videoData.hd) {
                                await conn.sendMessage(from, {
                                    video: { url: videoData.hd },
                                    caption: `*𝚂𝙸𝙻𝙰 𝙼𝙳* - 𝙷𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢\n\n> © Powered by Sila Tech`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                                }, { quoted: msg });
                            } else {
                                await conn.sendMessage(from, { 
                                    text: "𝙷𝙳 𝚗𝚘𝚝 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎. 𝚂𝚎𝚗𝚍𝚒𝚗𝚐 𝚂𝙳 𝚚𝚞𝚊𝚕𝚒𝚝𝚢.\n\n> © Powered by Sila Tech",
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                                }, { quoted: msg });
                                
                                await conn.sendMessage(from, {
                                    video: { url: videoData.sd },
                                    caption: `*𝚂𝙸𝙻𝙰 𝙼𝙳* - 𝚂𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢\n\n> © Powered by Sila Tech`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                                }, { quoted: msg });
                            }
                            break;
                            
                        case "3":
                        case "➌":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/mpeg",
                                caption: `*𝚂𝙸𝙻𝙰 𝙼𝙳* - 𝙰𝚞𝚍𝚒𝚘 𝙾𝚗𝚕𝚢\n\n> © Powered by Sila Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        case "4":
                        case "➍":
                            await conn.sendMessage(from, {
                                document: { url: videoData.sd },
                                mimetype: "video/mp4",
                                fileName: `SILA_MD_${Date.now()}.mp4`,
                                caption: `*𝚂𝙸𝙻𝙰 𝙼𝙳* - 𝚅𝚒𝚍𝚎𝚘 𝙳𝚘𝚌𝚞𝚖𝚎𝚗𝚝\n\n> © Powered by Sila Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        case "5":
                        case "➎":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/ogg; codecs=opus",
                                ptt: true,
                                caption: `*𝚂𝙸𝙻𝙰 𝙼𝙳* - 𝚅𝚘𝚒𝚌𝚎 𝙼𝚎𝚜𝚜𝚊𝚐𝚎\n\n> © Powered by Sila Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        default:
                            await conn.sendMessage(from, { 
                                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚘𝚘𝚜𝚎 𝚊 𝚗𝚞𝚖𝚋𝚎𝚛 (𝟷-𝟻) 𝚘𝚗𝚕𝚢.\n\n> © Powered by Sila Tech",
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                    }
                    
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                }
            } catch (e) {
                console.error("❌ FB Reply Handler Error:", e);
            }
        });

    } catch (error) {
        console.error("❌ FB Command Error:", error);
        await conn.sendMessage(from, { 
            text: `❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚟𝚒𝚍𝚎𝚘. 𝙴𝚛𝚛𝚘𝚛: ${error.message}\n\n> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender }, "𝐒𝐈𝐋𝐀 𝐌𝐃", "255789661031")
        }, { quoted: fkontak });
    }
});