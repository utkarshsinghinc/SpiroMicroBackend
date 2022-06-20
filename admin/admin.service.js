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
    const admin = await db.admin.scope('withHash').findOne({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.hash)))
        throw 'email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: admin.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(admin.get()), token };
}

async function getAll() {
    return await db.admin.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.admin.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save admin
    await db.admin.create(params);
}

async function update(id, params) {
    const admin = await getUser(id);

    // validate
    const usernameChanged = params.email && admin.email !== params.email;
    if (usernameChanged && await db.admin.findOne({ where: { email: params.email } })) {
        throw 'email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to admin and save
    Object.assign(admin, params);
    await admin.save();

    return omitHash(admin.get());
}

async function _delete(id) {
    const admin = await getUser(id);
    await admin.destroy();
}

// helper functions

async function getUser(id) {
    const admin = await db.admin.findByPk(id);
    if (!admin) throw 'admin not found';
    return admin;
}

function omitHash(admin) {
    const { hash, ...userWithoutHash } = admin;
    return userWithoutHash;
}