const { default: makeWASocket, useMultiFileAuthState, Browsers, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs-extra');
const path = require('path');

async function botCommand(sock, chatId, message) {
    try {
        const sender = message.key.remoteJid;
        const userNumber = message.key.participant?.split('@')[0] || sender.split('@')[0];

        // Send initial reaction
        await sock.sendMessage(sender, {
            react: { text: '🐢', key: message.key }
        });

        // Send processing message
        await sock.sendMessage(sender, {
            text: '*╭━━━〔 🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 🐢 〕━━━┈⊷*\n*┃🐢│ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙿𝚁𝙾𝙲𝙴𝚂𝚂 𝚂𝚃𝙰𝚁𝚃𝙴𝙳...*\n*╰━━━━━━━━━━━━━━━┈⊷*'
        }, { quoted: message });

        // Create session directory
        const sessionPath = path.join('./session', `session_${userNumber}`);
        await fs.ensureDir(sessionPath);

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const logger = pino({ level: 'fatal' });

        // Create new socket for pairing
        const pairingSocket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: state.keys,
            },
            printQRInTerminal: false,
            logger,
            browser: Browsers.macOS('Safari')
        });

        let pairingCode;
        let retries = 3;

        // Request pairing code
        while (retries > 0) {
            try {
                await delay(2000);
                pairingCode = await pairingSocket.requestPairingCode(userNumber);
                break;
            } catch (error) {
                retries--;
                console.warn(`Failed to request pairing code, retries left: ${retries}`, error.message);
                if (retries === 0) throw error;
                await delay(3000);
            }
        }

        // Send pairing code to user
        const pairingMessage = `
*╭━━━〔 🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 🐢 〕━━━┈⊷*
*┃🐢│ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙲𝙾𝙳𝙴 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳*
*┃🐢╰──────────────────*
*┃🐢│ 𝙲𝙾𝙳𝙴 :❯ ${pairingCode}*
*┃🐢│ 𝚄𝚂𝙴𝚁 :❯ ${userNumber}*
*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙰𝙲𝚃𝙸𝚅𝙴*
*╰━━━━━━━━━━━━━━━┈⊷*

*📱 𝙸𝙽𝚂𝚃𝚁𝚄𝙲𝚃𝙸𝙾𝙽𝚂:*
𝟷. 𝙾𝙿𝙴𝙽 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙾𝙽 𝚈𝙾𝚄𝚁 𝙿𝙷𝙾𝙽𝙴
𝟸. 𝙶𝙾 𝚃𝙾 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 > 𝙻𝙸𝙽𝙺𝙴𝙳 𝙳𝙴𝚅𝙸𝙲𝙴𝚂
𝟹. 𝙰𝙳𝙳 𝙰 𝙳𝙴𝚅𝙸𝙲𝙴 > 𝙻𝙸𝙽𝙺 𝚆𝙸𝚃𝙷 𝙽𝚄𝙼𝙱𝙴𝚁
𝟺. 𝙴𝙽𝚃𝙴𝚁 𝚃𝙷𝙸𝚂 𝙲𝙾𝙳𝙴: *${pairingCode}*

*🐢 𝙱𝙾𝚃 𝚆𝙸𝙻𝙻 𝙰𝚄𝚃𝙾-𝙳𝙴𝙿𝙻𝙾𝚈 𝙰𝙵𝚃𝙴𝚁 𝙿𝙰𝙸𝚁𝙸𝙽𝙶!*`;

        await sock.sendMessage(sender, { 
            text: pairingMessage 
        }, { quoted: message });

        // Send notification to admin
        await sendAdminNotification(sock, userNumber);

        // Setup credential saving
        pairingSocket.ev.on('creds.update', saveCreds);

        // Monitor connection status
        pairingSocket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'open') {
                // Send success message
                await sock.sendMessage(sender, {
                    text: `*╭━━━〔 🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 🐢 〕━━━┈⊷*\n*┃🐢│ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻!*\n*┃🐢│ 𝙱𝙾𝚃 𝙸𝚂 𝙽𝙾𝚆 𝙰𝙲𝚃𝙸𝚅𝙴*\n*┃🐢│ 𝚄𝚂𝙴𝚁 :❯ ${userNumber}*\n*╰━━━━━━━━━━━━━━━┈⊷*\n\n*🚀 𝙱𝙾𝚃 𝙰𝚄𝚃𝙾-𝙳𝙴𝙿𝙻𝙾𝚈𝙼𝙴𝙽𝚃 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴!*`
                }, { quoted: message });

                // Auto-join groups and channels
                await autoJoinGroupsAndChannels(pairingSocket, userNumber);
                
                // Close pairing socket
                await pairingSocket.ws.close();
            }

            if (connection === 'close') {
                if (lastDisconnect?.error?.output?.statusCode !== 401) {
                    await sock.sendMessage(sender, {
                        text: '*❌ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙵𝙰𝙸𝙻𝙴𝙳. 𝚃𝚁𝚈 .𝙱𝙾𝚃 𝙰𝙶𝙰𝙸𝙽*'
                    }, { quoted: message });
                }
                await pairingSocket.ws.close();
            }
        });

    } catch (error) {
        console.error('Error in bot command:', error);
        await sock.sendMessage(message.key.remoteJid, {
            text: '*❌ 𝙴𝚁𝚁𝙾𝚁 𝙸𝙽 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙿𝚁𝙾𝙲𝙴𝚂𝚂*\n\n*𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽 𝙻𝙰𝚃𝙴𝚁 𝙾𝚁 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙾𝚆𝙽𝙴𝚁*'
        }, { quoted: message });
    }
}

async function sendAdminNotification(sock, userNumber) {
    try {
        const adminNumber = '255612491554@s.whatsapp.net';
        const notificationMessage = `
*╭━━━〔 🐢 𝙽𝙴𝚆 𝚄𝚂𝙴𝚁 𝙰𝙻𝙴𝚁𝚃 🐢 〕━━━┈⊷*
*┃🐢│ 𝙽𝙴𝚆 𝚄𝚂𝙴𝚁 𝙿𝙰𝙸𝚁𝙴𝙳 𝙱𝙾𝚃!*
*┃🐢╰──────────────────*
*┃🐢│ 𝚄𝚂𝙴𝚁 :❯ ${userNumber}*
*┃🐢│ 𝚃𝙸𝙼𝙴 :❯ ${new Date().toLocaleString()}*
*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙸𝙽 𝙿𝚁𝙾𝙶𝚁𝙴𝚂𝚂*
*╰━━━━━━━━━━━━━━━┈⊷*`;

        await sock.sendMessage(adminNumber, { 
            text: notificationMessage 
        });

        // Send reaction to admin
        await sock.sendMessage(adminNumber, {
            react: { text: '🐢', key: { id: 'admin_notification', remoteJid: adminNumber } }
        });

    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}

async function autoJoinGroupsAndChannels(socket, userNumber) {
    try {
        const groups = [
            'https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks', // BOT.USER
            'https://chat.whatsapp.com/C03aOCLQeRUH821jWqRPC6'  // SILATECH
        ];

        const channels = [
            '120363402325089913@newsletter', // MAIN CHANNEL
        ];

        // Join groups
        for (const groupLink of groups) {
            try {
                const inviteCode = groupLink.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/)?.[1];
                if (inviteCode) {
                    await socket.groupAcceptInvite(inviteCode);
                    console.log(`✅ Joined group: ${groupLink}`);
                }
            } catch (error) {
                console.log(`❌ Failed to join group: ${groupLink}`, error.message);
            }
            await delay(2000);
        }

        // Follow channels
        for (const channelId of channels) {
            try {
                await socket.newsletterFollow(channelId);
                console.log(`✅ Followed channel: ${channelId}`);
            } catch (error) {
                console.log(`❌ Failed to follow channel: ${channelId}`, error.message);
            }
            await delay(2000);
        }

        // Set auto bio
        const bioMessage = '🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 | 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝚃𝙴𝙲𝙷';
        try {
            await socket.updateProfileStatus(bioMessage);
            console.log('✅ Bio updated successfully');
        } catch (error) {
            console.log('❌ Failed to update bio:', error.message);
        }

    } catch (error) {
        console.error('Error in auto-join setup:', error);
    }
}

module.exports = botCommand;