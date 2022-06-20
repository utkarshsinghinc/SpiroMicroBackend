﻿const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const multer = require('multer')

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, uhid }) {
    const patient = await db.patient.scope('withHash').findOne({ where: { email } });

    if (!patient || !(await bcrypt.compare(uhid, patient.hash)))
        throw 'email or uhid is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: patient.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(patient.get()), token };
}

async function getAll() {
    return await db.patient.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.patient.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash uhid
    if (params.uhid) {
        params.hash = await bcrypt.hash(params.uhid, 10);
    }

    // save patient
    await db.patient.create(params);
}

async function update(id, params) {
    const patient = await getUser(id);

    // validate
    const usernameChanged = params.email && patient.email !== params.email;
    if (usernameChanged && await db.patient.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash uhid if it was entered
    if (params.uhid) {
        params.hash = await bcrypt.hash(params.uhid, 10);
    }

    // copy params to patient and save
    Object.assign(patient, params);
    await patient.save();

    return omitHash(patient.get());
}

async function _delete(id) {
    const patient = await getUser(id);
    await patient.destroy();
}

// helper functions

async function getUser(id) {
    const patient = await db.patient.findByPk(id);
    if (!patient) throw 'patient not found';
    return patient;
}

function omitHash(patient) {
    const { hash, ...userWithoutHash } = patient;
    return userWithoutHash;
}

