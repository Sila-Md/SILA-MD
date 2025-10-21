const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "📇",
    alias: ["gc_tagall","appel"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("❌ Only group admins or the bot owner can use this command.");
        }

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ No members found in this group.");

        let emojis = ['*├❒┃➢🪐*','*├❒┃➢🍁*','*├❒┃➢💥*','*├❒┃➢🩸*','*├❒┃➢❄️*','*├❒┃➢🕸️*'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "ʜᴇʟʟᴏ ᴇᴠᴇʀʏᴏɴᴇ"; // Default message

        let teks = `*╭╼━━━━⧼ᴍᴇɴᴛɪᴏɴs⧽━━━━╾╮*
*│👥ɢʀᴏᴜᴘ: ${groupName}*
*│🎰ᴍᴇᴍʙᴇʀs: ${totalMembers}*
*│📝ᴍᴇssᴀɢᴇ: ${message}*
*│🛡️ᴀᴅᴍɪɴs: ɴᴏᴛ ᴅᴇғɪɴᴇᴅ*
*╰╼━━━━━━━━━━━━━━━━╾╯*

*╭╼┉┉┉┉〔ᴛᴀɢᴀʟʟs〕┉┉┉┉╮*
`;

        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "*└╼┉┉┉┉✪ RAHEEM-XMD-3 ✪┉┉┉┉*";

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });
 
    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});

