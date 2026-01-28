const { isAdmin } = require('../lib/isAdmin');

// Helper function to safely extract JID string
const extractJidString = (jid) => {
    if (!jid) return '';
    if (typeof jid === 'string') return jid;
    if (typeof jid === 'object' && jid.id) return jid.id;
    if (typeof jid === 'object' && jid.toString) return jid.toString();
    return '';
};

// Function to handle manual promotions via command
async function promoteCommand(sock, chatId, mentionedJids, message) {
    try {
        // Check if it's a group
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, { 
                text: 'This command can only be used in groups!'
            });
            return;
        }

        let userToPromote = [];
        
        // Check for mentioned users
        if (mentionedJids && mentionedJids.length > 0) {
            userToPromote = mentionedJids;
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
        }
        
        // If no user found through either method
        if (userToPromote.length === 0) {
            await sock.sendMessage(chatId, { 
                text: 'Please mention the user or reply to their message to promote!'
            }, { quoted: message });
            return;
        }

        // Extract JID strings from all promotion targets
        const userJids = userToPromote
            .map(u => extractJidString(u))
            .filter(jid => jid && jid.includes('@'));

        if (userJids.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid user format. Please mention a valid user.'
            }, { quoted: message });
            return;
        }

        try {
            await sock.groupParticipantsUpdate(chatId, userJids, "promote");
            
            // Get usernames for each promoted user
            const usernames = userJids.map(jid => {
                const username = jid.split('@')[0];
                return `@${username || 'unknown'}`;
            });

            // Get promoter's name
            const promoterJid = extractJidString(sock.user.id);
            const promoterName = promoterJid.split('@')[0];
            
            const promotionMessage = `*┏━❑ 𝗚𝗥𝗢𝗨𝗣 𝗣𝗥𝗢𝗠𝗢𝗧𝗜𝗢𝗡 ━━━━━━━━━
┃
┃ 👥 𝗨𝘀𝗲𝗿${userJids.length > 1 ? '𝘀' : ''} 𝗣𝗿𝗼𝗺𝗼𝘁𝗲𝗱:
${usernames.map(name => `┃ ⤷ ${name}`).join('\\n')}
┃
┃ 👑 𝗣𝗿𝗼𝗺𝗼𝘁𝗲𝗱 𝗕𝘆: @${promoterName}
┃ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleString()}
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
            
            await sock.sendMessage(chatId, { 
                text: promotionMessage,
                mentions: userJids
            }, { quoted: message });
        } catch (promoteError) {
            console.error('Error promoting user(s):', promoteError);
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to promote user(s). Make sure I have admin permissions.'
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in promote command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ An error occurred while processing the promote command.'
        }, { quoted: message });
    }
}

// Function to handle automatic promotion detection
async function handlePromotionEvent(sock, groupId, participants, author) {
    try {
        // Ensure participants is an array and contains valid data
        if (!Array.isArray(participants)) {
            console.error('Invalid participants data:', participants);
            return;
        }

        // Convert all participants to JID strings
        const participantJids = participants.map(p => extractJidString(p)).filter(jid => jid && jid.includes('@'));
        
        if (participantJids.length === 0) {
            console.error('No valid participants found');
            return;
        }

        // Get usernames for promoted participants
        const promotedUsernames = participantJids.map(jidString => {
            const username = jidString.split('@')[0];
            return `@${username || 'unknown'}`;
        });

        let promotedBy;
        let mentionList = participantJids;

        if (author) {
            const authorJid = extractJidString(author);
            if (authorJid && authorJid.includes('@')) {
                promotedBy = `@${authorJid.split('@')[0]}`;
                mentionList = [...participantJids, authorJid];
            } else {
                promotedBy = 'System';
            }
        } else {
            promotedBy = 'System';
        }

        const promotionMessage = `*┏━❑ 𝗚𝗥𝗢𝗨𝗣 𝗣𝗥𝗢𝗠𝗢𝗧𝗜𝗢𝗡 ━━━━━━━━━
┃
┃ 👥 𝗨𝘀𝗲𝗿${participantJids.length > 1 ? '𝘀' : ''} 𝗣𝗿𝗼𝗺𝗼𝘁𝗲𝗱:
${promotedUsernames.map(name => `┃ ⤷ ${name}`).join('\\n')}
┃
┃ 👑 𝗣𝗿𝗼𝗺𝗼𝘁𝗲𝗱 𝗕𝘆: ${promotedBy}
┃ 📅 𝗗𝗮𝘁𝗲: ${new Date().toLocaleString()}
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        await sock.sendMessage(groupId, {
            text: promotionMessage,
            mentions: mentionList
        });
    } catch (error) {
        console.error('Error handling promotion event:', error);
    }
}

module.exports = { promoteCommand, handlePromotionEvent };
