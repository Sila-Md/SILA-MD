const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "close",
    alias: ["group-close"],
    react: "🔇",
    desc: "CLOSE THE GROUP (ONLY ADMINS CAN SEND MESSAGES).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("*❌ THIS COMMAND CAN ONLY BE USED IN GROUPS.*");
        if (!isAdmins) return reply("*❌ ONLY GROUP ADMINS CAN USE THIS COMMAND.*");
        if (!isBotAdmins) return reply("*❌ I NEED TO BE AN ADMIN TO MUTE THE GROUP.*");

        await conn.groupSettingUpdate(from, "announcement");
        reply("*✅ GROUP HAS BEEN CLOSED.* *ONLY ADMINS CAN SEND MESSAGES.*");
    } catch (e) {
        console.error("*ERROR CLOSING GROUP:*", e);
        reply("*❌ FAILED TO CLOSE THE GROUP.* *PLEASE TRY AGAIN.*");
    }
});
