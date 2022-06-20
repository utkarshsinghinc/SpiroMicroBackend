const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middlewareAdmin/validate-request');
const authorize = require('_middlewareAdmin/authorize')
const adminService = require('./admin.service');

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
    adminService.authenticate(req.body)
        .then(admin => res.json(admin))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        fname: Joi.string().required(),
        sname: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
        //docEC: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    adminService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    adminService.getAll()
        .then(admins => res.json(admins))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.admin);
}

function getById(req, res, next) {
    adminService.getById(req.params.id)
        .then(admin => res.json(admin))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        fname: Joi.string().empty(''),
        sname: Joi.string().empty(''),
        email: Joi.string().empty(''),
        password: Joi.string().min(6).empty(''),
        //docEC: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    adminService.update(req.params.docEC, req.body)
        .then(admin => res.json(admin))
        .catch(next);
}

function _delete(req, res, next) {
    adminService.delete(req.params.id)
        .then(() => res.json({ message: 'admin deleted successfully' }))
        .catch(next);
}