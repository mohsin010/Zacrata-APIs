const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {

        let ext = '';

        if (file.mimetype == 'application/image')
            ext = path.extname(file.originalname);

        console.log(ext)

        callback(null, Date.now() + '.png');
    }
})

module.exports = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
})