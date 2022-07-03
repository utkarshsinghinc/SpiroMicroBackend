﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_middleware/error-handler');
global.__basedir = __dirname;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/doctors', require('./doctors/doctors.controller'));
app.use('/patients', require('./patients/patients.controller'));
//app.use('/audioUpload', require('./audioUpload/index'))
app.use('/admins', require('./admin/admins.controller'));
app.use('/audios', require('./audioUpload/index'))
//app.use('/audios', require("./avUp/Index"))
// const initRoutes = require("./routes");
// app.use(express.urlencoded({ extended: true }));
// initRoutes(app);
// const router = require('./routes/productRouter.js')
// app.use('/api/products', router)

//static Images Folder

//app.use('/Images', express.static('./Images'))
// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));