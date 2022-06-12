const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middlewarePatient/validate-request');
const authorize = require('../_middlewarePatient/authorize')
const patientService = require('./patient.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        uhid: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    patientService.authenticate(req.body)
        .then(patient => res.json(patient))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        fname: Joi.string().required(),
        sname: Joi.string().required(),
        uhid: Joi.string().required(),
        pnumber: Joi.string().required(),
        email: Joi.string().required(),
        age: Joi.string().required(),
        gender: Joi.string().required(),
        Height: Joi.string().required(),
        Weight: Joi.string().required(),
        Smoking: Joi.string().required(),
        Chest: Joi.string().required(),
        docId: Joi.string().required(),
        hospital: Joi.string().required(),
        hash: Joi.string(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    patientService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    patientService.getAll()
        .then(patients => res.json(patients))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.patient);
}

function getById(req, res, next) {
    patientService.getById(req.params.id)
        .then(patient => res.json(patient))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        fname: Joi.string().empty(''),
        sname: Joi.string().empty(''),
        email: Joi.string().empty(''),
        uhid: Joi.string().min(6).empty(''),
        hospital: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    patientService.update(req.params.id, req.body)
        .then(patient => res.json(patient))
        .catch(next);
}

function _delete(req, res, next) {
    patientService.delete(req.params.id)
        .then(() => res.json({ message: 'patient deleted successfully' }))
        .catch(next);
}