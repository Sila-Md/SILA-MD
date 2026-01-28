const { handleGoodbye } = require('../lib/welcome');
const { isGoodByeOn, getGoodbye } = require('../lib/index');
const fetch = require('node-fetch');

// Helper function to safely extract JID string
const extractJidString = (jid) => {
    if (!jid) return '';
    if (typeof jid === 'string') return jid;
    if (typeof jid === 'object' && jid.id) return jid.id;
    if (typeof jid === 'object' && jid.toString) return jid.toString();
    return '';
};

async function goodbyeCommand(sock, chatId, message, match) {
    // Check if it's a group
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: 'This command can only be used in groups.' });
        return;
    }

    // Extract match from message
    const text = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleGoodbye(sock, chatId, message, matchText);
}

async function handleLeaveEvent(sock, id, participants) {
    // Check if goodbye is enabled for this group
    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled) return;

    // Get custom goodbye message
    const customMessage = await getGoodbye(id);

    // Get group metadata
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;

    // Send goodbye message for each leaving participant
    for (const participant of participants) {
        try {
            // Handle case where participant might be an object or not a string
            const participantString = extractJidString(participant);
            if (!participantString || !participantString.includes('@')) {
                console.error('Invalid participant format:', participant);
                continue;
            }
            const user = participantString.split('@')[0];
            
            // Get user's display name
            let displayName = user; // Default to phone number
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact && contact.name) {
                    displayName = contact.name;
                } else {
                    // Try to get from group participants
                    const groupParticipants = groupMetadata.participants;
                    const userParticipant = groupParticipants.find(p => p.id === participantString);
                    if (userParticipant && userParticipant.name) {
                        displayName = userParticipant.name;
                    }
                }
            } catch (nameError) {
                console.log('Could not fetch display name, using phone number');
            }
            
            // Use custom message if available, otherwise use default
            let goodbyeMessage;
            if (customMessage) {
                goodbyeMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName);
            } else {
                goodbyeMessage = ` *@${displayName}* we will never miss you! `;
            }
            
            // Get user profile picture
            let profilePicUrl = `https://img.pyrocdn.com/dbKUgahg.png`; // Default avatar
            try {
                const profilePic = await sock.profilePictureUrl(participantString, 'image');
                if (profilePic) {
                    profilePicUrl = profilePic;
                }
            } catch (profileError) {
                console.log('Could not fetch profile picture, using default');
            }
            
            // Construct API URL for goodbye image
            const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming1?type=leave&textcolor=red&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${groupMetadata.participants.length}&avatar=${encodeURIComponent(profilePicUrl)}`;
            
            // Fetch the goodbye image
            const response = await fetch(apiUrl);
            if (response.ok) {
                const imageBuffer = await response.buffer();
                
                // Send goodbye image with stylish caption
                await sock.sendMessage(id, {
                    image: imageBuffer,
                    caption: goodbyeMessage,
                    mentions: [participantString]
                });
            } else {
                // Fallback to text message if API fails
                await sock.sendMessage(id, {
                    text: goodbyeMessage,
                    mentions: [participantString]
                });
            }
        } catch (error) {
            console.error('Error sending goodbye message:', error);
            // Fallback to text message
            const participantString = extractJidString(participant);
            if (!participantString || !participantString.includes('@')) {
                console.error('Invalid participant format in fallback:', participant);
                continue;
            }
            const user = participantString.split('@')[0];
            const goodbyeMessage = ` *@${user}* we will never miss you! `;
            await sock.sendMessage(id, {
                text: goodbyeMessage,
                mentions: [participantString]
            });
        }
    }
}

module.exports = { goodbyeCommand, handleLeaveEvent };
