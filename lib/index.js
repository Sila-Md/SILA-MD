const { DeletedText,
    DeletedMedia,
    AntiDelete, } = require('./antidel');
//const { AntiViewOnce } = require('./antivv');
const {
  DATABASE
} = require('./database');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./functions');
const {sms, downloadMediaMessage} = require('./msg');
//const {shannzCdn} = require('./shannzCdn');

// Antilink functions
const setAntilink = async (chatId, status, action) => {
    try {
        if (!DATABASE) return false;
        await DATABASE.collection('antilink').updateOne(
            { chatId },
            { $set: { chatId, enabled: true, action, updatedAt: new Date() } },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error('Error setting antilink:', error);
        return false;
    }
};

const getAntilink = async (chatId) => {
    try {
        if (!DATABASE) return null;
        return await DATABASE.collection('antilink').findOne({ chatId });
    } catch (error) {
        console.error('Error getting antilink:', error);
        return null;
    }
};

const removeAntilink = async (chatId) => {
    try {
        if (!DATABASE) return false;
        await DATABASE.collection('antilink').deleteOne({ chatId });
        return true;
    } catch (error) {
        console.error('Error removing antilink:', error);
        return false;
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
    //AntiViewOnce,
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
    DATABASE,
    sms,
    downloadMediaMessage,
    setAntilink,
    getAntilink,
    removeAntilink,
   // shannzCdn,
};
