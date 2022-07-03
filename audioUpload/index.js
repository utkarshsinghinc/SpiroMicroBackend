const express = require('express');
const multer = require('multer');
//const path = require('path');
const router = express.Router();

//const uuid = require('uuid').v4;
//const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        // or 
        // uuid, or fieldname
        cb(null, originalname);
    }
})
const upload = multer({ storage }); // or simply { dest: 'uploads/' }
router.use(express.static('public'))
router.use(express.urlencoded({ extended: true }))

router.post('/upload', upload.single("avatar"), (req, res) => {
    res.json({ status: 'OK' });
    console.log(req.body)
    console.log(req.file)
});
module.exports = router;