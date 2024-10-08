const fs = require('fs');


class StorageService {
    constructor(folder) {
        this._folder = folder;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true })
        }
    }

    writeFile(file, meta) {
        const filename = +new Date() + meta.filename;
        const path = `${this._folder}/${filename}`;

        const fileStream = fs.createWriteStream(path);

        return new Promise((resolve, rejects) => {
            fileStream.on('error', (error) => rejects(error));
            file.pipe(fileStream)
            file.on('end', () => resolve(filename));
        })
    }

    async deleteFile(filename) {
        const path = `${this._folder}/${filename}`;

        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
}

module.exports = StorageService;