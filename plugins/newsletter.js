const { cmd } = require('../command');

cmd({
    pattern: "newsletter",
    desc: "Displays the @newsletter ID of the current channel",
    category: "tools",
    react: "📰",
    filename: __filename
},
async (conn, mek, m) => {
    const newsletterJid = m.chat;

    // Journaliser l'utilisation de la commande
    console.log(`[NEWSLETTER] Command used in: ${newsletterJid}`);

    if (!newsletterJid.endsWith("@newsletter")) {
        return conn.sendMessage(newsletterJid, {
            text: "This command must be used inside a WhatsApp channel (@newsletter)."
        }, { quoted: mek });
    }

    // Optionnel : Vérifie si le JID semble valide (commence par "120")
    if (!newsletterJid.startsWith("120")) {
        return conn.sendMessage(newsletterJid, {
            text: "This does not appear to be a valid WhatsApp channel ID."
        }, { quoted: mek });
    }

    // Date et heure actuelle
    const now = new Date().toLocaleString();

    // Affiche l'ID du canal + date
    await conn.sendMessage(newsletterJid, {
        text: `Channel ID:\n\n*${newsletterJid}*\n\n🕒 *Executed on:* ${now}`
    }, { quoted: mek });

    // Simule un message transféré d’un autre canal
    const fakeNewsletterJid = '120363399470975987@newsletter';
    const fakeNewsletterName = 'SILATRIX-MD';
    const serverMessageId = 101;
    const message = `Forwarded from another newsletter:\n\n*${newsletterJid}*`;

    await conn.sendMessage(
        newsletterJid,
        {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: fakeNewsletterJid,
                    newsletterName: fakeNewsletterName,
                    serverMessageId: serverMessageId
                }
            }
        },
        { quoted: mek }
    );
});
