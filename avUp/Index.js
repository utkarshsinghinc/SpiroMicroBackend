const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const router = express.Router()
//const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = `tmp`; // specify the path you want to store file
        //check if file path exists or create the directory
        fs.access(dir, function (error) {
            if (error) {
                console.log("Directory does not exist.");
                return fs.mkdir(dir, error => cb(error, dir));
            } else {
                console.log("Directory exists.");
                return cb(null, dir);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // added Date.now() so that name will be unique
    }
});
const uploadFiles = multer({ storage: storage });
router.post("/fileupload", uploadFiles.single("file"), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    res.json({
        success: true,
        statusCode: 200,
        fileName: file.filename
    });
}
)

module.exports = router;