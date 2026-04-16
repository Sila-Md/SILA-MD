const { cmd } = require('../command');
const axios = require('axios');

// Define combined fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐒𝐈𝐋𝐀-𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐒𝐈𝐋𝐀 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐒𝐈𝐋𝐀-𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255789661031:+255789661031\nEND:VCARD`
    }
  }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: "cecan",
    alias: ["vietnam", "vcecan", "beauty"],
    react: "😍",
    desc: "Get random beauty image by country",
    category: "wakubwa",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    // Default country is vietnam
    let country = q?.trim() || 'vietnam';
    country = country.toLowerCase();

    // Validate country
    const validCountries = ['vietnam', 'korea', 'japan', 'china', 'indonesia', 'thailand'];
    if (!validCountries.includes(country)) {
        return await conn.sendMessage(from, {
            text: `❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚌𝚘𝚞𝚗𝚝𝚛𝚢\n\n𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚘𝚞𝚗𝚝𝚛𝚒𝚎𝚜:\n${validCountries.join(', ')}\n\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: .𝚌𝚎𝚌𝚊𝚗 𝚔𝚘𝚛𝚎𝚊`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
    }

    // Show typing indicator
    await conn.sendPresenceUpdate('composing', from);

    // Call API with country parameter
    const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/${country}`, {
        timeout: 30000,
        responseType: 'arraybuffer'
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    await conn.sendPresenceUpdate('paused', from);

    // Country flags
    const flags = {
        vietnam: '🇻🇳',
        korea: '🇰🇷',
        japan: '🇯🇵',
        china: '🇨🇳',
        indonesia: '🇮🇩',
        thailand: '🇹🇭'
    };

    const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

    // Send image
    await conn.sendMessage(from, {
        image: Buffer.from(response.data),
        caption: `😍 𝑹𝒂𝒏𝒅𝒐𝒎 ${countryCapitalized} 𝑩𝒆𝒂𝒖𝒕𝒚 ${flags[country]}\n\n© Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = '❌ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍';
    
    if (e.response?.status === 429) {
        errorMsg = '❌ 𝚁𝚊𝚝𝚎 𝚕𝚒𝚖𝚒𝚝𝚎𝚍 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛';
    } else if (e.response?.status === 500) {
        errorMsg = '❌ 𝙰𝙿𝙸 𝚜𝚎𝚛𝚟𝚎𝚛 𝚎𝚛𝚛𝚘𝚛';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = '❌ 𝚁𝚎𝚚𝚞𝚎𝚜𝚝 𝚝𝚒𝚖𝚎𝚘𝚞𝚝';
    }

    await conn.sendMessage(from, {
        text: errorMsg,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    l(e);
}
});

