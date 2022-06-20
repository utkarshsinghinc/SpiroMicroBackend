const express = require('express')
//const app = express()
//const bodyParser = require('body-parser')
const router = express.Router()

// const port = 5000
// const cors = require('cors')n
const multer = require('multer')
var upload = multer({ dest: 'audio/' })
const fs = require('fs')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'audio/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     },
// })

// const upload = multer({ storage: storage })


// router.post('/audio', upload.single('file'), function (req, res) {
//     res.json({})
// })
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.json({
        success: true
    })
})


router.post('/', (req, res) => {
    console.log(req.body)
    res.status(200)
})

router.post('/upload', upload.single('document'), (req, res) => {
    console.log(req.file, req.body)
});

module.exports = router;
