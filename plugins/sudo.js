const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m, ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃", formattedOwnerNumber = "255789661031") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: ${ownerName}`,
            body: `📞 wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://files.catbox.moe/98k75b.jpeg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

const OWNER_PATH = path.join(__dirname, "../assets/sudo.json");

// Ensure the sudo.json file exists
const ensureOwnerFile = () => {
  if (!fs.existsSync(OWNER_PATH)) {
    fs.writeFileSync(OWNER_PATH, JSON.stringify([]));
  }
};

// Command: Add a temporary owner
cmd({
    pattern: "setsudo",
    alias: ["addsudo", "addowner"],
    desc: "Add a temporary owner",
    category: "owner",
    react: "😇",
    filename: __filename
}, async (conn, mek, m, { from, args, q, isCreator, reply, sender }) => {
    try {
        const ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃";
        const formattedOwnerNumber = "255789661031";
        
        if (!isCreator) {
            return await conn.sendMessage(from, { 
                text: "_❗𝚃𝚑𝚒𝚜 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙲𝚊𝚗 𝙾𝚗𝚕𝚢 𝙱𝚎 𝚄𝚜𝚎𝚍 𝙱𝚢 𝙼𝚢 𝙾𝚠𝚗𝚎𝚛!_\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        // Identify the target user
        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚗𝚞𝚖𝚋𝚎𝚛 𝚘𝚛 𝚝𝚊𝚐/𝚛𝚎𝚙𝚕𝚢 𝚊 𝚞𝚜𝚎𝚛.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        ensureOwnerFile();
        let owners = JSON.parse(fs.readFileSync(OWNER_PATH, "utf-8"));

        if (owners.includes(target)) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝚃𝚑𝚒𝚜 𝚞𝚜𝚎𝚛 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚊 𝚝𝚎𝚖𝚙𝚘𝚛𝚊𝚛𝚢 𝚘𝚠𝚗𝚎𝚛.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        owners.push(target);
        const uniqueOwners = [...new Set(owners)];
        fs.writeFileSync(OWNER_PATH, JSON.stringify(uniqueOwners, null, 2));

        const successMsg = "✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝙰𝚍𝚍𝚎𝚍 𝚄𝚜𝚎𝚛 𝙰𝚜 𝚃𝚎𝚖𝚙𝚘𝚛𝚊𝚛𝚢 𝙾𝚠𝚗𝚎𝚛";
        
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/98k75b.jpeg" },
            caption: `${successMsg}\n\n> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
        
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { 
            text: "❌ 𝙴𝚛𝚛𝚘𝚛: " + err.message + "\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender }, "𝐒𝐈𝐋𝐀 𝐌𝐃", "255789661031")
        }, { quoted: fkontak });
    }
});

// Command: Remove a temporary owner
cmd({
    pattern: "delsudo",
    alias: ["delowner", "deletesudo"],
    desc: "Remove a temporary owner",
    category: "owner",
    react: "🫩",
    filename: __filename
}, async (conn, mek, m, { from, args, q, isCreator, reply, sender }) => {
    try {
        const ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃";
        const formattedOwnerNumber = "255789661031";
        
        if (!isCreator) {
            return await conn.sendMessage(from, { 
                text: "_❗𝚃𝚑𝚒𝚜 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙲𝚊𝚗 𝙾𝚗𝚕𝚢 𝙱𝚎 𝚄𝚜𝚎𝚍 𝙱𝚢 𝙼𝚢 𝙾𝚠𝚗𝚎𝚛!_\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚗𝚞𝚖𝚋𝚎𝚛 𝚘𝚛 𝚝𝚊𝚐/𝚛𝚎𝚙𝚕𝚢 𝚊 𝚞𝚜𝚎𝚛.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        ensureOwnerFile();
        let owners = JSON.parse(fs.readFileSync(OWNER_PATH, "utf-8"));

        if (!owners.includes(target)) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝚄𝚜𝚎𝚛 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍 𝚒𝚗 𝚘𝚠𝚗𝚎𝚛 𝚕𝚒𝚜𝚝.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        const updated = owners.filter(x => x !== target);
        fs.writeFileSync(OWNER_PATH, JSON.stringify(updated, null, 2));

        const successMsg = "✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚁𝚎𝚖𝚘𝚟𝚎𝚍 𝚄𝚜𝚎𝚛 𝙰𝚜 𝚃𝚎𝚖𝚙𝚘𝚛𝚊𝚛𝚢 𝙾𝚠𝚗𝚎𝚛";
        
        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/98k75b.jpeg" },
            caption: `${successMsg}\n\n> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
        
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { 
            text: "❌ 𝙴𝚛𝚛𝚘𝚛: " + err.message + "\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender }, "𝐒𝐈𝐋𝐀 𝐌𝐃", "255789661031")
        }, { quoted: fkontak });
    }
});

// Command: List all temporary owners
cmd({
    pattern: "listsudo",
    alias: ["listowner"],
    desc: "List all temporary owners",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply, sender }) => {
    try {
        const ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃";
        const formattedOwnerNumber = "255789661031";
        
        if (!isCreator) {
            return await conn.sendMessage(from, { 
                text: "_❗𝚃𝚑𝚒𝚜 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙲𝚊𝚗 𝙾𝚗𝚕𝚢 𝙱𝚎 𝚄𝚜𝚎𝚍 𝙱𝚢 𝙼𝚢 𝙾𝚠𝚗𝚎𝚛!_\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        ensureOwnerFile();
        let owners = JSON.parse(fs.readFileSync(OWNER_PATH, "utf-8"));
        owners = [...new Set(owners)];

        if (owners.length === 0) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙽𝚘 𝚝𝚎𝚖𝚙𝚘𝚛𝚊𝚛𝚢 𝚘𝚠𝚗𝚎𝚛𝚜 𝚏𝚘𝚞𝚗𝚍.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        let listMessage = "`🤴 𝙻𝚒𝚜𝚝 𝚘𝚏 𝚂𝚞𝚍𝚘 𝙾𝚠𝚗𝚎𝚛𝚜:`\n\n";
        owners.forEach((owner, i) => {
            listMessage += `${i + 1}. ${owner.replace("@s.whatsapp.net", "")}\n`;
        });
        
        listMessage += "\n> © Powered by Sila Tech";

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/98k75b.jpeg" },
            caption: listMessage,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
        
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { 
            text: "❌ 𝙴𝚛𝚛𝚘𝚛: " + err.message + "\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender }, "𝐒𝐈𝐋𝐀 𝐌𝐃", "255789661031")
        }, { quoted: fkontak });
    }
});