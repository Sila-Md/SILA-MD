const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { spawn } = require('child_process');

class AudioEditor {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
        this.ensureTempDir();
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    getRandom(ext) {
        return `${Math.floor(Math.random() * 10000)}${ext}`;
    }

    async cleanFile(file) {
        if (file && fs.existsSync(file)) {
            await fs.promises.unlink(file).catch(() => {});
        }
    }

    async processAudio(buffer, ext, ffmpegArgs) {
        const inputPath = path.join(this.tempDir, this.getRandom(`.${ext}`));
        const outputPath = path.join(this.tempDir, this.getRandom('.mp3'));

        try {
            await fs.promises.writeFile(inputPath, buffer);
            
            return new Promise((resolve, reject) => {
                const ffmpeg = spawn(ffmpegPath, [
                    '-y',
                    '-i', inputPath,
                    ...ffmpegArgs,
                    outputPath
                ], { timeout: 30000 });

                ffmpeg.on('close', async (code) => {
                    await this.cleanFile(inputPath);
                    
                    if (code !== 0) {
                        await this.cleanFile(outputPath);
                        return reject(new Error(`FFmpeg process failed with code ${code}`));
                    }

                    try {
                        const result = await fs.promises.readFile(outputPath);
                        await this.cleanFile(outputPath);
                        resolve(result);
                    } catch (readError) {
                        reject(readError);
                    }
                });

                ffmpeg.on('error', (err) => {
                    reject(err);
                });
            });
        } catch (err) {
            await this.cleanFile(inputPath);
            await this.cleanFile(outputPath);
            throw err;
        }
    }

    // Audio Effects
    async bass(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-af', 'equalizer=f=54:width_type=o:width=2:g=20'
        ]);
    }

    async blown(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-af', 'acrusher=.1:1:64:0:log'
        ]);
    }

    async deep(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-af', 'atempo=4/4,asetrate=44500*2/3'
        ]);
    }

    async earrape(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-af', 'volume=12'
        ]);
    }

    async fast(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'atempo=1.63,asetrate=44100'
        ]);
    }

    async fat(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'atempo=1.6,asetrate=22100'
        ]);
    }

    async nightcore(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'atempo=1.06,asetrate=44100*1.25'
        ]);
    }

    async reverse(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter_complex', 'areverse'
        ]);
    }

    async robot(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter_complex', 'afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75'
        ]);
    }

    async slow(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'atempo=0.7,asetrate=44100'
        ]);
    }

    async smooth(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'aresample=48000,asetrate=48000*0.8'
        ]);
    }

    async tupai(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'atempo=0.5,asetrate=65100'
        ]);
    }

    async baby(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'asetrate=44100*1.5,atempo=1.2'
        ]);
    }

    async chipmunk(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'asetrate=44100*1.5,atempo=1.25'
        ]);
    }

    async demon(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'asetrate=44100*0.5,atempo=0.8'
        ]);
    }

    async radio(buffer, ext) {
        return this.processAudio(buffer, ext, [
            '-filter:a', 'bandreject=f=1000:w=100'
        ]);
    }
}

module.exports = new AudioEditor();

