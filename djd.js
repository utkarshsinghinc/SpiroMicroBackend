const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'audio/' });
const app = express()
const videoStorage = multer.diskStorage({
    destination: 'audio', // Destination to store video 
    filename: (req, file, cb) => {
        console.log('Attempting storage')
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 10
    },
    fileFilter(req, file, cb) {
        console.log('Attempting file filter stuff')
        if (!file.originalname.match(/\.(m4a|MPEG-4|mkv|mov|MOV)$/)) {
            console.log(file.originalname, 'Video uploaded fail')
            return cb(new Error('Please upload a video'))
        }
        cb(undefined, true)
    }
})

// This method will save a "photo" field from the request as a file.
app.post('/multipart-upload', videoUpload.single('audio'), (req, res) => {
    console.log(req.body, 'Completed upload');
    res.end('OK');
});

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));