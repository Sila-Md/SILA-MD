const axios = require('axios')
const config = require('../config') // Create this file if not exists

// ============================================
// 📌 FAKE VCARD (Global)
// ============================================
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

// ============================================
// 📌 CONTEXT INFO GENERATOR
// ============================================
const getContextInfo = (m, ownerName = 'Owner', formattedOwnerNumber = '255*********') => {
    return {
        mentionedJid: m.mentionedJid || [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: `© Bot`,
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `📞 wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://telegra.ph/file/example.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

// ============================================
// 📌 BUTTON FUNCTIONS
// ============================================

/**
 * Send interactive buttons message
 * @param {Object} conn - WhatsApp connection
 * @param {String} jid - Chat ID
 * @param {String} text - Message text
 * @param {Array} buttons - Array of button objects [{buttonId: 'id', buttonText: {displayText: 'text'}, type: 1}]
 * @param {String} footer - Footer text
 * @param {Object} options - Additional options
 */
const sendButtonMessage = async (conn, jid, text, buttons, footer = '', options = {}) => {
    try {
        const buttonMessage = {
            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1,
            ...options
        };
        
        return await conn.sendMessage(jid, buttonMessage, { ...options });
    } catch (error) {
        console.error('Error sending button message:', error);
        return null;
    }
};

/**
 * Send template buttons (supports URL, Call, Quick Reply)
 * @param {Object} conn - WhatsApp connection
 * @param {String} jid - Chat ID
 * @param {String} text - Message text
 * @param {String} footer - Footer text
 * @param {Array} buttons - Array of button objects [{text: 'text', id: 'id'}, {text: 'url', url: 'https://...'}, {text: 'call', call: '255...'}]
 * @param {Object} options - Additional options
 */
const sendTemplateButton = async (conn, jid, text, footer, buttons, options = {}) => {
    try {
        const templateButtons = buttons.map((btn, index) => {
            if (btn.url) {
                return {
                    index: btn.index || index + 1,
                    urlButton: {
                        displayText: btn.text,
                        url: btn.url
                    }
                };
            } else if (btn.call) {
                return {
                    index: btn.index || index + 1,
                    callButton: {
                        displayText: btn.text,
                        phoneNumber: btn.call
                    }
                };
            } else {
                return {
                    index: btn.index || index + 1,
                    quickReplyButton: {
                        displayText: btn.text,
                        id: btn.id || btn.text.toLowerCase().replace(/\s+/g, '_')
                    }
                };
            }
        });

        const templateMessage = {
            text: text,
            footer: footer,
            templateButtons: templateButtons,
            ...options
        };

        return await conn.sendMessage(jid, templateMessage, { ...options });
    } catch (error) {
        console.error('Error sending template button:', error);
        return null;
    }
};

/**
 * Send interactive list message (dropdown menu)
 * @param {Object} conn - WhatsApp connection
 * @param {String} jid - Chat ID
 * @param {String} text - Message text
 * @param {String} footer - Footer text
 * @param {String} title - List title
 * @param {String} buttonText - Button text
 * @param {Array} sections - Array of section objects [{title: 'Section', rows: [{title: 'Option', description: 'Desc', rowId: 'id'}]}]
 * @param {Object} options - Additional options
 */
const sendListMessage = async (conn, jid, text, footer, title, buttonText, sections, options = {}) => {
    try {
        const listMessage = {
            text: text,
            footer: footer,
            title: title,
            buttonText: buttonText,
            sections: sections,
            ...options
        };

        return await conn.sendMessage(jid, listMessage, { ...options });
    } catch (error) {
        console.error('Error sending list message:', error);
        return null;
    }
};

/**
 * Create simple button array
 * @param {Array} buttons - Array of {text, id} objects
 * @returns {Array} Formatted buttons array for sendButtonMessage
 */
const createButtons = (buttons) => {
    return buttons.map((btn, index) => ({
        buttonId: btn.id || `btn_${index + 1}`,
        buttonText: { displayText: btn.text },
        type: 1
    }));
};

/**
 * Create section for list message
 * @param {String} title - Section title
 * @param {Array} rows - Array of {title, description, rowId} objects
 * @returns {Object} Section object
 */
const createSection = (title, rows) => {
    return {
        title: title,
        rows: rows.map(row => ({
            title: row.title,
            description: row.description || '',
            rowId: row.rowId || row.title.toLowerCase().replace(/\s+/g, '_')
        }))
    };
};

// ============================================
// 📌 EXISTING FUNCTIONS (Zako zote zipo hapa)
// ============================================

const getBuffer = async(url, options) => {
    try {
        options = options || {}
        var res = await axios({
            method: 'get',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(e)
        return null
    }
}

const getGroupAdmins = (participants) => {
    var admins = []
    for (let i of participants) {
        if(i.admin !== null) admins.push(i.id)
    }
    return admins
}

const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

const h2k = (eco) => {
    var lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E']
    var ma = Math.log10(Math.abs(eco)) / 3 | 0
    if (ma == 0) return eco
    var ppo = lyrik[ma]
    var scale = Math.pow(10, ma * 3)
    var scaled = eco / scale
    var formatt = scaled.toFixed(1)
    if (/\.0$/.test(formatt))
        formatt = formatt.substr(0, formatt.length - 2)
    return formatt + ppo
}

const isUrl = (url) => {
    return url.match(
        new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
            'gi'
        )
    )
}

const Json = (string) => {
    return JSON.stringify(string, null, 2)
}

const runtime = (seconds) => {
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor(seconds % (3600 * 24) / 3600)
    var m = Math.floor(seconds % 3600 / 60)
    var s = Math.floor(seconds % 60)
    var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
    var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

const sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const fetchJson = async (url, options) => {
    try {
        options = options || {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

// ============================================
// 📌 EXPORTS - Zote functions zinatoka hapa
// ============================================
module.exports = { 
    // Button Related
    fkontak,
    getContextInfo,
    sendButtonMessage,
    sendTemplateButton,
    sendListMessage,
    createButtons,
    createSection,
    
    // Existing Functions
    getBuffer, 
    getGroupAdmins, 
    getRandom, 
    h2k, 
    isUrl, 
    Json, 
    runtime, 
    sleep, 
    fetchJson 
}
