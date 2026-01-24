const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        // Step 1: Send reaction first
        await sock.sendMessage(chatId, {
            react: {
                text: '🎵', // Emoji ya muziki inayofaa kwa download ya song
                key: message.key
            }
        });

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "*╭━━━〔 🐢 𝙿𝙻𝙰𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n" +
                      "*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                      "*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙿𝙻𝙴𝙰𝚂𝙴 𝙴𝙽𝚃𝙴𝚁 𝚂𝙾𝙽𝙶 𝙽𝙰𝙼𝙴*\n" +
                      "*╰━━━━━━━━━━━━━━━┈⊷*"
            });
        }

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "*╭━━━〔 🐢 𝙿𝙻𝙰𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n" +
                      "*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                      "*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙽𝙾 𝚂𝙾𝙽𝙶𝚂 𝙵𝙾𝚄𝙽𝙳*\n" +
                      "*╰━━━━━━━━━━━━━━━┈⊷*"
            });
        }

        // Send loading message with design
        await sock.sendMessage(chatId, {
            text: "*╭━━━〔 🐢 𝙿𝙻𝙰𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n" +
                  "*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶*\n" +
                  "*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃...*\n" +
                  "*╰━━━━━━━━━━━━━━━┈⊷*"
        });

        // Get the first video result
        const video = videos[0];
        const urlYt = video.url;

        // Fetch audio data from API
        const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.downloadUrl) {
            return await sock.sendMessage(chatId, { 
                text: "*╭━━━〔 🐢 𝙿𝙻𝙰𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n" +
                      "*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                      "*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙰𝙿𝙸 𝙵𝙰𝙸𝙻𝙴𝙳*\n" +
                      "*╰━━━━━━━━━━━━━━━┈⊷*"
            });
        }

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        // Send the audio with caption design
        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: `*╭━━━〔 🐢 𝙿𝙻𝙰𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n` +
                     `*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝚂𝚄𝙲𝙲𝙴𝚂𝚂*\n` +
                     `*┃🐢│ 𝚃𝙸𝚃𝙻𝙴 :❯ ${title}*\n` +
                     `*┃🐢│ 𝚀𝚄𝙰𝙻𝙸𝚃𝚈 :❯ 𝙼𝙿𝟹*\n` +
                     `*╰━━━━━━━━━━━━━━━┈⊷*\n\n` +
                     `*𝙴𝙽𝙹𝙾𝚈 𝚈𝙾𝚄𝚁 𝙼𝚄𝚂𝙸𝙲! 🐢*`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in song2 command:', error);
        await sock.sendMessage(chatId, { 
            text: "*╭━━━〔 🐢 𝙿𝙻𝙰𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 🐢 〕━━━┈⊷*\n" +
                  "*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙴𝚁𝚁𝙾𝚁*\n" +
                  "*┃🐢│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 :❯ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙵𝙰𝙸𝙻𝙴𝙳*\n" +
                  "*╰━━━━━━━━━━━━━━━┈⊷*"
        });
    }
}

module.exports = playCommand;