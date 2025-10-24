const config = require('../config');
const { cmd } = require('../command');

const MUSIC_URL = "https://files.catbox.moe/ebj284.jpg"; // Customize if needed

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "🍁",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = new Date().getTime();

        // Random emoji reaction
        const emojis = ['⏰', '⚡', '🚀', '🔥', '💥', '🎯', '🛸', '📡', '🧠'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        await conn.sendMessage(from, {
            react: { text: emoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        // Multiple fancy styles
        const styles = [
`╭━━━━❖ *PING TEST 1* ❖━━━━╮
┃ ⚡ *BOT:* ${config.BOT_NAME}
┃ 🧭 *PING:* *${responseTime.toFixed(2)}s*
┃ 🔖 *Prefix:* ${config.PREFIX}
╰━━━━━━━━━━━━━━━━━━━━━━━╯
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.OWNER_NAME}* 💙`,

`┏━━━⪨ *SPEED TEST* ⪩━━━┓
┃ 🤖 *BOT:* ${config.BOT_NAME}
┃ ⚙️ *MODE:* ${config.MODE}
┃ 🛸 *LATENCY:* ${responseTime.toFixed(2)}s
┃ 🎯 *OWNER:* ${config.OWNER_NAME}
┗━━━━━━━━━━━━━━━━━━━━━┛
> *𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`,

`⏱️ *Response Time:* *${responseTime.toFixed(2)} seconds*
🤖 Bot: *${config.BOT_NAME}*
🔋 Status: *Online*
✨ Ping Check Complete!
> _by ${config.OWNER_NAME}_`
        ];

        const caption = styles[Math.floor(Math.random() * styles.length)];

        await conn.sendMessage(from, {
            text: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422610520277@newsletter',
                    newsletterName: config.BOT_NAME || 'SILA TECH',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send optional audio
        await conn.sendMessage(from, {
            audio: { url: MUSIC_URL },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});


// ✅ ping2 (enhanced)
cmd({
    pattern: "ping2",
    desc: "Check bot's response time - simple test.",
    category: "main",
    react: "📡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        const message = await conn.sendMessage(from, { text: '*Checking ping... 🧪*' });
        const endTime = Date.now();
        const ping = endTime - startTime;

        const styles2 = [
`╭━━〔 *PING-2 RESULT* 〕━━╮
┃ 🛠️ *BOT* : *${config.BOT_NAME}*
┃ 🚀 *LATENCY* : *${ping} ms*
╰━━━━━━━━━━━━━━━━━━━━╯
> _by ${config.OWNER_NAME}_`,

`┏━ *FAST SPEED CHECK* ━┓
┃ 🔥 Ping: ${ping} ms
┃ 👤 Owner: ${config.OWNER_NAME}
┃ 🤖 Mode: ${config.MODE}
┗━━━━━━━━━━━━━━━━━━━━━━┛`
        ];

        const caption2 = styles2[Math.floor(Math.random() * styles2.length)];

        await conn.sendMessage(from, {
            text: caption2
        }, { quoted: message });

        await conn.sendMessage(from, {
            audio: { url: MUSIC_URL },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping2 command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
