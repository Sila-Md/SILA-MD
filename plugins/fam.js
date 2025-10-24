//credits:Raheem-cm

const { cmd } = require("../command");

// Command: friends
cmd({
    pattern: "friends",
    alias: ["myfriends", "bffs"],
    desc: "Show a stylish list of your friends",
    category: "fun",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    try {
        // ✅ Customize your friends here
        const friendsList = [
            "👑 𝙱𝚎𝚎𝚣𝚒𝚕𝚊",
            "🔥 𝙼𝚛.𝚂𝚒𝚕𝚊",
            "💎 𝚂𝚒𝚕𝚊𝚝𝚛𝚒𝚡",
            "🌟 𝚁𝚒𝚌𝚑-𝚋𝚎𝚜𝚜",
            "⚡ 𝚁𝚊𝚑𝚎𝚎𝚖-𝚌𝚖"
        ];

        let msg = `[<<<<✦❘༻༺❘✦>>>>]
   💖 *MY FRIENDS LIST* 💖
[<<<<✦❘༻༺❘✦>>>>]

${friendsList.join("\n")}

✨ Always loyal • Always shining ✨`;

        reply(msg);
    } catch (err) {
        reply("❌ Error showing friends list.");
        console.error(err);
    }
});
