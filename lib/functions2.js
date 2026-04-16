const fs = require('fs');
const axios = require('axios');
const FormData = require("form-data");
const path = './config.env';

// ============================================
// 📌 EMPIRE TO URL UPLOAD
// ============================================
async function empiretourl(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  const form = new FormData();
  const fileStream = fs.createReadStream(path);
  form.append("file", fileStream);
  const originalFileName = path.split("/").pop(); 
  form.append("originalFileName", originalFileName);

  try {
    const response = await axios.post("https://cdn.empiretech.biz.id/api/upload.php", form, {
      headers: {
        ...form.getHeaders(), 
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      throw new Error("No response received from the server.");
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
}

// ============================================
// 📌 Fetch a buffer from a URL
// ============================================
const getBuffer = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'get',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

// ============================================
// 📌 Get admin participants from a group
// ============================================
const getGroupAdmins = (participants) => {
    const admins = [];
    for (let participant of participants) {
        if (participant.admin !== null) admins.push(participant.id);
    }
    return admins;
};

// ============================================
// 📌 Generate a random string with an extension
// ============================================
const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

// ============================================
// 📌 Format large numbers with suffixes
// ============================================
const h2k = (eco) => {
    const lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const ma = Math.floor(Math.log10(Math.abs(eco)) / 3);
    if (ma === 0) return eco.toString();
    const scale = Math.pow(10, ma * 3);
    const scaled = eco / scale;
    const formatted = scaled.toFixed(1).replace(/\.0$/, '');
    return formatted + lyrik[ma];
};

// ============================================
// 📌 Check if a string is a URL
// ============================================
const isUrl = (url) => {
    return url.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/
    );
};

// ============================================
// 📌 Convert to JSON string
// ============================================
const Json = (string) => {
    return JSON.stringify(string, null, 2);
};

// ============================================
// 📌 Calculate and format uptime
// ============================================
const runtime = (seconds) => {
    seconds = Math.floor(seconds);
    const d = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const h = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

// ============================================
// 📌 Delay execution
// ============================================
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// ============================================
// 📌 Fetch JSON from a URL
// ============================================
const fetchJson = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// ============================================
// 📌 Save config settings
// ============================================
const saveConfig = (key, value) => {
    let configData = fs.existsSync(path) ? fs.readFileSync(path, 'utf8').split('\n') : [];
    let found = false;

    configData = configData.map(line => {
        if (line.startsWith(`${key}=`)) {
            found = true;
            return `${key}=${value}`;
        }
        return line;
    });

    if (!found) configData.push(`${key}=${value}`);

    fs.writeFileSync(path, configData.join('\n'), 'utf8');
    require('dotenv').config({ path });
};

// ============================================
// 📌 EXPORTS
// ============================================
module.exports = { 
    getBuffer, 
    getGroupAdmins, 
    getRandom, 
    h2k, 
    isUrl, 
    Json, 
    runtime, 
    sleep, 
    fetchJson,
    saveConfig,
    empiretourl
};
