const settings = require('../settings');
const os = require('os');

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message, pushname, config) {
    // Hakikisha config ipo, iwapo haipo tumia default
    const prefix = config && config.PREFIX ? config.PREFIX : '.';
    const mode = settings.mode || '𝙿𝚄𝙱𝙻𝙸𝙲';
    const version = settings.version || '1.𝟶.𝟶';
    const now = new Date();
    const date = now.toLocaleDateString('en-GB');
    const time = now.toLocaleTimeString('en-US', { hour12: true });
    const uptime = formatUptime(process.uptime());
    const totalMemGB = (os.totalmem() / (1024 ** 3)).toFixed(1);
    const usedMemGB = ((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(1);
    const ram = `${usedMemGB}GB/${totalMemGB}GB`;
    const plugins = fs.readdirSync(path.join(__dirname, '../silatech')).filter(file => file.endsWith('.js')).length;
    const userNumber = message.key.participant ? message.key.participant.split('@')[0] : chatId.split('@')[0];
    const modeDisplay = 'PUBLIC';
    const helpMessage = `
┏━❑ 𝐒𝐈𝐋𝐀-𝐌𝐃 𝐌𝐄𝐍𝐔 ━━━━━━━━━
┃ 🚀 𝙼𝚘𝚍𝚎: ${modeDisplay}
┃ ⚙️ 𝙿𝚛𝚎𝚏𝚒𝚡: ${prefix}
┃ 👤 𝚄𝚜𝚎𝚛: ${userNumber}
┃ 📦 𝙿𝚕𝚞𝚐𝚒𝚗𝚜: ${plugins}
┃ ⏱️ 𝚄𝚙𝚝𝚒𝚖𝚎: ${uptime}
┃ 📅 𝙳𝚊𝚝𝚎: ${date}
┃ 🕐 𝚃𝚒𝚖𝚎: ${time}
┃ 💾 𝚁𝙰𝙼: ${ram}
┗━━━━━━━━━━━━━━━━━━━━

📋 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂

┏━❑ 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 ━━━━━━━━━
┃ ⤷ .silamenu
┃ ⤷ .help / .menu
┃ ⤷ .ping
┃ ⤷ .alive
┃ ⤷ .owner
┃ ⤷ .joke
┃ ⤷ .quote
┃ ⤷ .fact
┃ ⤷ .lyrics <song>
┃ ⤷ .8ball <question>
┃ ⤷ .groupinfo
┃ ⤷ .staff / .admins
┃ ⤷ .jid
┃ ⤷ .silatech
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐀𝐃𝐌𝐈𝐍 ━━━━━━━━━
┃ ⤷ .ban @user
┃ ⤷ .promote @user
┃ ⤷ .demote @user
┃ ⤷ .mute <minutes>
┃ ⤷ .unmute
┃ ⤷ .delete / .del
┃ ⤷ .kick @user
┃ ⤷ .warnings @user
┃ ⤷ .antilink
┃ ⤷ .clear
┃ ⤷ .tag <message>
┃ ⤷ .tagall
┃ ⤷ .tagnotadmin
┃ ⤷ .resetlink
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐎𝐖𝐍𝐄𝐑 ━━━━━━━━━
┃ ⤷ .mode <public/private>
┃ ⤷ .clearsession
┃ ⤷ .antidelete
┃ ⤷ .update
┃ ⤷ .settings
┃ ⤷ .setpp <image>
┃ ⤷ .autoreact <on/off>
┃ ⤷ .autostatus <on/off>
┃ ⤷ .autotyping <on/off>
┃ ⤷ .antical <on/off>
┃ ⤷ .sila
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐌𝐄𝐃𝐈𝐀 ━━━━━━━━━
┃ ⤷ .blur <image>
┃ ⤷ .sticker <image>
┃ ⤷ .removebg
┃ ⤷ .remini
┃ ⤷ .meme
┃ ⤷ .ig <instagram link>
┃ ⤷ .igs <instagram link>
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐀𝐈 ━━━━━━━━━
┃ ⤷ .silaai <question>
┃ ⤷ .gpt <question>
┃ ⤷ .gemini <question>
┃ ⤷ .imagine <prompt>
┃ ⤷ .flux <prompt>
┃ ⤷ .sora <prompt>
┃ ⤷ .silapic <prompt>
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐅𝐔𝐍 ━━━━━━━━━
┃ ⤷ .complement @user
┃ ⤷ .insult @user
┃ ⤷ .ship @user
┃ ⤷ .sim @user
┃ ⤷ .stupid @user [text]
┃ ⤷ .flirt
┃ ⤷ .shayari
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 ━━━━━━━━━
┃ ⤷ .silaplay <song>
┃ ⤷ .silavideo <query>
┃ ⤷ .play <song>
┃ ⤷ .song <song>
┃ ⤷ .spotify <query>
┃ ⤷ .instagram <link>
┃ ⤷ .facebook <link>
┃ ⤷ .tiktok <link>
┃ ⤷ .video <song>
┃ ⤷ .ytmp4 <link>
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐓𝐄𝐗𝐓 𝐌𝐀𝐊𝐄𝐑 ━━━━━━━━━
┃ ⤷ .metallic <text>
┃ ⤷ .ice <text>
┃ ⤷ .snow <text>
┃ ⤷ .matrix <text>
┃ ⤷ .light <text>
┃ ⤷ .neon <text>
┃ ⤷ .devil <text>
┃ ⤷ .glitch <text>
┃ ⤷ .fire <text>
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐆𝐀𝐌𝐄 ━━━━━━━━━
┃ ⤷ .tictactoe @user
┃ ⤷ .hangman
┃ ⤷ .guess <letter>
┃ ⤷ .trivia
┃ ⤷ .truth
┃ ⤷ .dare
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐀𝐍𝐈𝐌𝐄 ━━━━━━━━━
┃ ⤷ .neko
┃ ⤷ .waifu
┃ ⤷ .loli
┃ ⤷ .poke
┃ ⤷ .kiss
┃ ⤷ .pat
┃ ⤷ .hug
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐌𝐈𝐒𝐂 ━━━━━━━━━
┃ ⤷ .heart
┃ ⤷ .circle
┃ ⤷ .lgbt
┃ ⤷ .namecard
┃ ⤷ .tweet
┗━━━━━━━━━━━━━━━━━━━━

┏━❑ 𝐓𝐎𝐎𝐋𝐒 ━━━━━━━━━
┃ ⤷ .tts <text>
┃ ⤷ .translate <text> <lang>
┃ ⤷ .ss <link>
┃ ⤷ .weather <city>
┃ ⤷ .news
┃ ⤷ .attp <text>
┗━━━━━━━━━━━━━━━━━━━━

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 𝐒𝐈𝐋𝐀-𝐌𝐃 𝐁𝐎𝐓 © 𝟸𝟶𝟸6
┃ 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑 🔧
┗━━━━━━━━━━━━━━━━━━━━┛`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363402325089913@newsletter',
                        newsletterName: 'SILA MD',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363402325089913@newsletter',
                        newsletterName: 'SILA TECH',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
