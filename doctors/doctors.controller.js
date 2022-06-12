const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const doctorService = require('./doctor.service');

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
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    doctorService.authenticate(req.body)
        .then(doctor => res.json(doctor))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        fname: Joi.string().required(),
        sname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
        hospital: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    doctorService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    doctorService.getAll()
        .then(doctors => res.json(doctors))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.doctor);
}

function getById(req, res, next) {
    doctorService.getById(req.params.id)
        .then(doctor => res.json(doctor))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        fname: Joi.string().empty(''),
        sname: Joi.string().empty(''),
        email: Joi.string().empty(''),
        password: Joi.string().min(6).empty(''),
        hospital: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    doctorService.update(req.params.id, req.body)
        .then(doctor => res.json(doctor))
        .catch(next);
}

function _delete(req, res, next) {
    doctorService.delete(req.params.id)
        .then(() => res.json({ message: 'doctor deleted successfully' }))
        .catch(next);
}