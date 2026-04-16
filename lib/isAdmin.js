const isAdmin = async (conn, groupId, userId) => {
	try {
		const metadata = await conn.groupMetadata(groupId);
		
		// Normalize userId - remove @s.whatsapp.net if present and add it back
		const normalizedUserId = userId.includes('@') ? userId : userId + '@s.whatsapp.net';
		
		const participant = metadata.participants.find(p => p.id === normalizedUserId);
		
		const isSenderAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
		
		// Check if bot is admin
		const botId = conn.user.id;
		const normalizedBotId = botId.includes('@') ? botId : botId + '@s.whatsapp.net';
		const botParticipant = metadata.participants.find(p => p.id === normalizedBotId);
		const isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
		
		return {
			isSenderAdmin,
			isBotAdmin
		};
	} catch (error) {
		console.error('Error checking admin status:', error);
		return {
			isSenderAdmin: false,
			isBotAdmin: false
		};
	}
};

module.exports = isAdmin;
