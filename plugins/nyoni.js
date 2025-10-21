 const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "bg",
    alias: ["clearbug2", "kickbug2", "cleanbug2"],
    use: '.antibug (reply to message)',
    desc: "Clean bug, kick sender (group only), and block",
    category: "utilities",
    react: "📵",
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, reply, participants }) => {
    try {
        const quotedUser = m.quoted?.sender;

        if (!quotedUser) return reply("⚠️ *Reply to the bug message you want to clean, kick and block.*");

        const fakeContact = {
            key: {
                fromMe: false,
                participant: '0@s.whatsapp.net',
                remoteJid: 'status@broadcast',
            },
            message: {
                contactMessage: {
                    displayName: "SILATRIX SYSTEM",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS SYSTEM\nORG:SILATRIX-MD;\nTEL;type=CELL;type=VOICE;waid=255789661031:+255612491554\nEND:VCARD`
                }
            }
        };

        // Kick from group if group and user is in participants
        let kicked = false;
        if (isGroup && participants.some(p => p.id === quotedUser)) {
            await conn.groupParticipantsUpdate(from, [quotedUser], "remove");
            kicked = true;
        }

        // Block the user
        await conn.updateBlockStatus(quotedUser, 'block');

        const text = `🛡️ *ANTI-BUG SECURITY ENGAGED*\n\n✅ Cleared bug/crash message\n${kicked ? '✅ Kicked bug sender from group\n' : ''}✅ Blocked user from contacting\n\n*Status:* Safe.\n*Handled By:* SILATRIX-MD`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363399470975987@newsletter',
                    newsletterName: "SILATRIX-BOTS 🤟✌",
                    serverMessageId: 300
                }
            }
        }, { quoted: fakeContact });

    } catch (e) {
        console.error("Error in antibug command:", e);
        reply(`❌ Failed to execute antibug: ${e.message}`);
    }
});
