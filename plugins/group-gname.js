const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "updategname",
    alias: ["xtreme-name", "gname"],
    react: "📝",
    desc: "CHANGE THE GROUP NAME.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        if (!isGroup) return reply("*❌ This command can only be used in groups.*");
        if (!isAdmins) return reply("*❌ Only group admins can use this command.*");
        if (!isBotAdmins) return reply("*❌ I need to be an admin to update the group name.*");
        if (!q) return reply("❌ Please provide a new group name.*");

        await conn.groupUpdateSubject(from, q);
        reply(`*✅ GROUP NAME HAS BEEN UPDATED TO:* *${q}*`);
    } catch (e) {
        console.error("Error updating group name:", e);
        reply("❌ Failed to update the group name. Please try again.");
    }
});
