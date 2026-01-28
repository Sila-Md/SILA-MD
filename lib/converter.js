const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure database directory exists
      const dbDir = path.join(__dirname, '../database')
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
      }

      let tmp = path.join(dbDir, + new Date + '.' + ext)
      let out = tmp + '.' + ext2
      
      // Write input file
      await fs.promises.writeFile(tmp, buffer)
      
      // Check if input file was actually written
      if (!fs.existsSync(tmp)) {
        return reject(new Error(`Failed to write temporary input file: ${tmp}`))
      }

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ])

      let ffmpegError = ''
      
      ffmpegProcess.stderr.on('data', (data) => {
        ffmpegError += data.toString()
      })

      ffmpegProcess.on('error', (err) => {
        // Clean up on error
        try {
          if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
          if (fs.existsSync(out)) fs.unlinkSync(out)
        } catch (e) {}
        reject(new Error(`FFmpeg spawn error: ${err.message}`))
      })

      ffmpegProcess.on('close', async (code) => {
        try {
          // Check input file exists before trying to delete it
          if (fs.existsSync(tmp)) {
            await fs.promises.unlink(tmp)
          }
          
          if (code !== 0) {
            if (fs.existsSync(out)) {
              await fs.promises.unlink(out)
            }
            return reject(new Error(`FFmpeg conversion failed with code ${code}: ${ffmpegError}`))
          }
          
          // Verify output file exists before reading
          if (!fs.existsSync(out)) {
            return reject(new Error(`Conversion output file not created: ${out}`))
          }
          
          const result = await fs.promises.readFile(out)
          await fs.promises.unlink(out)
          resolve(result)
        } catch (e) {
          // Try to clean up on error
          try {
            if (fs.existsSync(out)) await fs.promises.unlink(out)
          } catch (e2) {}
          reject(e)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ac', '2',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'mp3'
  ], ext, 'mp3')
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus')
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension 
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4')
}

module.exports = {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
}
