const isAdmin = require('../lib/isAdmin');

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        // Step 1: Send reaction first
        await sock.sendMessage(chatId, {
            react: {
                text: '📢', // Emoji ya kutangaza/mikophone inayofaa kwa tagall
                key: message.key
            }
        });

        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);
        

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { 
                text: '*╭━━━〔 🐢 𝚃𝙰𝙶𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n' +
                      '*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n' +
                      '*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙼𝙰𝙺𝙴 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽 𝙵𝙸𝚁𝚂𝚃*\n' +
                      '*╰━━━━━━━━━━━━━━━┈⊷*'
            }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { 
                text: '*╭━━━〔 🐢 𝚃𝙰𝙶𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n' +
                      '*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n' +
                      '*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙾𝙽𝙻𝚈 𝙰𝙳𝙼𝙸𝙽𝚂 𝙲𝙰𝙽 𝚄𝚂𝙴 𝚃𝙷𝙸𝚂*\n' +
                      '*╰━━━━━━━━━━━━━━━┈⊷*'
            }, { quoted: message });
            return;
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '*╭━━━〔 🐢 𝚃𝙰𝙶𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n' +
                      '*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n' +
                      '*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙽𝙾 𝙿𝙰𝚁𝚃𝙸𝙲𝙸𝙿𝙰𝙽𝚃𝚂 𝙵𝙾𝚄𝙽𝙳*\n' +
                      '*╰━━━━━━━━━━━━━━━┈⊷*'
            });
            return;
        }

        // Create message with each member on a new line inside box design
        let messageText = '*╭━━━〔 🐢 𝚃𝙰𝙶𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n';
        messageText += '*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝚂𝚄𝙲𝙲𝙴𝚂𝚂*\n';
        messageText += '*┃🐢│ 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 :❯ ' + participants.length + '*\n';
        messageText += '*┃🐢╰──────────────────*\n\n';
        messageText += '🔊 *𝙷𝙴𝙻𝙻𝙾 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴!* 🔊\n\n';
        
        participants.forEach((participant, index) => {
            const number = participant.id.split('@')[0];
            messageText += `👤 @${number}\n`;
        });

        messageText += '\n*╰━━━━━━━━━━━━━━━┈⊷*';

        // Send message with mentions
        await sock.sendMessage(chatId, {
            text: messageText,
            mentions: participants.map(p => p.id)
        });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, { 
            text: '*╭━━━〔 🐢 𝚃𝙰𝙶𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n' +
                  '*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n' +
                  '*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝚃𝙰𝙶 𝙼𝙴𝙼𝙱𝙴𝚁𝚂*\n' +
                  '*╰━━━━━━━━━━━━━━━┈⊷*'
        });
    }
}

module.exports = tagAllCommand;