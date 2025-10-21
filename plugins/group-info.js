const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group informations.",
    category: "group",
    use: '.ginfo',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
const msr = (await fetchJson('https://raw.githubusercontent.com/JawadTech3/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

if (!isGroup) return reply(msr.only_gp)
if (!isAdmins) { if (!isDev) return reply(msr.you_adm),{quoted:mek }} 
if (!isBotAdmins) return reply(msr.give_adm)
const ppUrls = [
        'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
        'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
        'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
      ];
let ppUrl = await conn.profilePictureUrl( from , 'image')
if (!ppUrl) { ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];}
const metadata = await conn.groupMetadata(from)
const groupAdmins = participants.filter(p => p.admin);
const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
const owner = metadata.owner

const gdata = `*╭╼━━⪨ GROUP INFO ⪩━━╾╮*
*┃📋G-NAME* - ${metadata.subject}
*┃🆔GROUP JID* - ${metadata.id}
*┃👥PARTICIPANT COUNT* - ${metadata.size}
*┃👑GROUP CREATOR* - ${owner.split('@')[0]}
*┃📝GROUP DESCRIPTION* - ${metadata.desc?.toString() || 'undefined'}\n
*┃🛡️GROUP ADMINS* - \n${listAdmin}\n
*╰╼━━━━━━━━━━━━━━━╾╯*
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ RAHEEM CM*`

await conn.sendMessage(from,{image:{url: ppUrl },caption: gdata },{quoted:mek })
} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`❌ *Error Accurated !!*\n\n${e}`)
}
} )
