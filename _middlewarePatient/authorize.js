const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.patient
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full patient record to request object
        async (req, res, next) => {
            // get patient with id from token 'sub' (subject) property
            const patient = await db.patient.findByPk(req.patient.sub);

            // check patient still exists
            if (!patient)
                return res.status(401).json({ message: 'Unauthorized' });

            // authorization successful
            req.patient = patient.get();
            next();
        }
    ];
}