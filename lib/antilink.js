const { isJidGroup } = require('@whiskeysockets/baileys');
const { getAntilink, incrementWarningCount, resetWarningCount, isSudo } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');
const config = require('../config');
const { readSettings } = require('../plugins/settings'); // Adjust path

const WARN_COUNT = config.WARN_COUNT || 3;

// Store warned users temporarily to avoid multiple warnings for same link
const warnedUsers = new Map();

/**
 * Checks if a string contains a URL.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string contains a URL, otherwise false.
 */
function containsURL(str) {
	const urlRegex = /(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?/i;
	return urlRegex.test(str);
}

/**
 * Checks if user is bot owner
 */
async function isOwner(sender) {
	try {
		const settings = await readSettings();
		const ownerNumber = settings.ownerNumber + '@s.whatsapp.net';
		return sender === ownerNumber;
	} catch (error) {
		console.log('Error checking owner:', error);
		return false;
	}
}

/**
 * Handles the Antilink functionality for group chats.
 *
 * @param {object} msg - The message object to process.
 * @param {object} sock - The socket object to use for sending messages.
 */
async function Antilink(msg, sock) {
	const jid = msg.key.remoteJid;
	if (!isJidGroup(jid)) return;

	const SenderMessage = msg.message?.conversation || 
						 msg.message?.extendedTextMessage?.text || '';
	if (!SenderMessage || typeof SenderMessage !== 'string') return;

	const sender = msg.key.participant;
	if (!sender) return;
	
	// Check if antilink is enabled for this group
	const antilinkConfig = await getAntilink(jid, 'on');
	if (!antilinkConfig) return;
	
	// Check if user is admin
	try {
		const { isSenderAdmin } = await isAdmin(sock, jid, sender);
		if (isSenderAdmin) return;
	} catch (_) {}
	
	// Check if user is sudo
	const senderIsSudo = await isSudo(sender);
	if (senderIsSudo) return;
	
	// Check if user is owner
	const senderIsOwner = await isOwner(sender);
	if (senderIsOwner) return;

	// Check if message contains URL
	if (!containsURL(SenderMessage.trim())) return;

	const action = antilinkConfig.action;
	
	// Check if user was already warned recently (avoid multiple warnings)
	const now = Date.now();
	const lastWarn = warnedUsers.get(sender) || 0;
	
	// If warned in the last 10 seconds, ignore
	if (now - lastWarn < 10000) {
		console.log(`User ${sender} already warned recently, skipping...`);
		return;
	}
	
	try {
		// Delete message first
		await sock.sendMessage(jid, { delete: msg.key });

		switch (action) {
			case 'delete':
				// Just delete, no message
				break;
				
			case 'delete-msg':
				await sock.sendMessage(jid, { 
					text: `\`\`\`@${sender.split('@')[0]} links are not allowed here\`\`\``,
					mentions: [sender] 
				});
				break;

			case 'kick':
				await sock.groupParticipantsUpdate(jid, [sender], 'remove');
				await sock.sendMessage(jid, {
					text: `\`\`\`@${sender.split('@')[0]} has been kicked for sending links\`\`\``,
					mentions: [sender]
				});
				break;

			case 'warn':
				const warningCount = await incrementWarningCount(jid, sender);
				
				// Record that this user was warned
				warnedUsers.set(sender, now);
				
				if (warningCount >= WARN_COUNT) {
					await sock.groupParticipantsUpdate(jid, [sender], 'remove');
					await resetWarningCount(jid, sender);
					await sock.sendMessage(jid, {
						text: `\`\`\`@${sender.split('@')[0]} has been kicked after ${WARN_COUNT} warnings for sending links\`\`\``,
						mentions: [sender]
					});
				} else {
					await sock.sendMessage(jid, {
						text: `\`\`\`@${sender.split('@')[0]} ⚠️ Warning ${warningCount}/${WARN_COUNT}\nReason: Links are not allowed\`\`\``,
						mentions: [sender]
					});
				}
				break;
				
			case 'silent':
				// Just delete, no message, no warn count
				break;
		}
	} catch (error) {
		console.error('Error in Antilink:', error);
	}
}

// Clean up warned users map every hour
setInterval(() => {
	const now = Date.now();
	for (const [user, timestamp] of warnedUsers.entries()) {
		if (now - timestamp > 3600000) { // 1 hour
			warnedUsers.delete(user);
		}
	}
}, 3600000);

module.exports = { Antilink };
