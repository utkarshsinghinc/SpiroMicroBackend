const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const doctor = await db.doctor.scope('withHash').findOne({ where: { email } });

    if (!doctor || !(await bcrypt.compare(password, doctor.hash)))
        throw 'email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: doctor.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(doctor.get()), token };
}

async function getAll() {
    return await db.doctor.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.doctor.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save doctor
    await db.doctor.create(params);
}

async function update(docEC, params) {
    const doctor = await getUser(docEC);

    // validate
    const usernameChanged = params.email && doctor.email !== params.email;
    if (usernameChanged && await db.doctor.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to doctor and save
    Object.assign(doctor, params);
    await doctor.save();

    return omitHash(doctor.get());
}

async function _delete(id) {
    const doctor = await getUser(id);
    await doctor.destroy();
}

// helper functions

async function getUser(id) {
    const doctor = await db.doctor.findByPk(id);
    if (!doctor) throw 'doctor not found';
    return doctor;
}

function omitHash(doctor) {
    const { hash, ...userWithoutHash } = doctor;
    return userWithoutHash;
}