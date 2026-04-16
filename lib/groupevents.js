const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

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

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const groupMembersCount = metadata.participants.length;

        for (const num of participants) {
            const userName = num.split("@")[0];

            let userPp;
            try {
                userPp = await conn.profilePictureUrl(num, 'image');
            } catch {
                userPp = null;
            }

            if (update.action === "add" && config.WELCOME === "true") {
                const msg = {
                    text: `┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ━━━━━━━━━
┃ 👋 𝙷𝚎𝚕𝚕𝚘 @${userName}
┃ 🎉 𝚆𝙰𝚙𝚦𝚗𝚐 𝚝𝚘 ${metadata.subject}
┃ 👥 𝙼𝚎𝚖𝚋𝚎𝚛𝚜: ${groupMembersCount}
┗━━━━━━━━━━━━━━━━━━━━

> © Powered by Sila Tech`,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                };

                if (userPp) {
                    msg.image = { url: userPp };
                    msg.caption = msg.text;
                    delete msg.text;
                }

                await conn.sendMessage(update.id, msg);

            } else if (update.action === "remove" && config.WELCOME === "true") {
                await conn.sendMessage(update.id, {
                    text: `┏━❑ 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━
┃ 👋 𝚂𝚎𝚎 𝚞 @${userName}
┃ 💔 𝙻𝚎𝚏𝚝 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙
┃ 👥 𝙼𝚎𝚖𝚋𝚎𝚛𝚜: ${groupMembersCount}
┗━━━━━━━━━━━━━━━━━━━━

> © Powered by Sila Tech`,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `┏━❑ 𝙰𝙳𝙼𝙸𝙽 𝙲𝙷𝚊𝙽𝙶𝙴 ━━━━━━━━━
┃ 👤 @${demoter}
┃ ⬇️ 𝚖𝚞𝚝𝚎𝚎 @${userName} 𝚏𝚛𝚘𝚖 𝚊𝚍𝚖𝚒𝚗
┗━━━━━━━━━━━━━━━━━━━━

> © Powered by Sila Tech`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `┏━❑ 𝙽𝙴𝚆 𝙰𝙳𝙼𝙸𝙽 ━━━━━━━━━
┃ 👤 @${promoter}
┃ ⬆️ 𝙿𝚛𝚘𝚖𝚘𝚝𝚎𝚍 @${userName} 👑
┗━━━━━━━━━━━━━━━━━━━━

> © Powered by Sila Tech`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "restrict" && config.ADMIN_EVENTS === "true") {
                await conn.sendMessage(update.id, {
                    text: `┏━❑ 𝙶𝚁𝙾𝚄𝙿 𝚄𝚙𝚍𝚊𝚝𝚎 ━━━━━━━━━
┃ 🔒 𝚁𝚎𝚜𝚝𝚛𝚒𝚌𝚝𝚎𝚍 𝙼𝚘𝚍𝚎 𝙰𝚌𝚝𝚒𝚟𝚊𝚝𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━

> © Powered by Sila Tech`,
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "announcement" && config.ADMIN_EVENTS === "true") {
                await conn.sendMessage(update.id, {
                    text: `┏━❑ 𝙰𝙽𝙽𝙾𝚄𝙽𝙲𝙴𝙼𝙴𝙽𝚃 ━━━━━━━━━
┃ 📢 𝚊𝙽𝚗𝚘𝚞𝚗𝚌𝚎𝚖𝚎𝚗𝚝 𝙼𝚘𝚍𝚎 𝙾𝙽
┗━━━━━━━━━━━━━━━━━━━━

> © Powered by Sila Tech`,
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
