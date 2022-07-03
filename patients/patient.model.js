const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        fname: { type: DataTypes.STRING, allowNull: false },
        sname: { type: DataTypes.STRING, allowNull: false },
        uhid: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        age: { type: DataTypes.STRING, allowNull: false },
        gender: { type: DataTypes.STRING, allowNull: false },
        Height: { type: DataTypes.STRING, allowNull: false },
        Weight: { type: DataTypes.STRING, allowNull: false },
        Smoking: { type: DataTypes.STRING, allowNull: false },
        Chest: { type: DataTypes.STRING, allowNull: false },
        docId: { type: DataTypes.STRING, allowNull: false },
        hospital: { type: DataTypes.STRING, allowNull: false },
        filelocation: { type: DataTypes.STRING, allowNull: true },
        hash: { type: DataTypes.STRING, allowNull: true }
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('patient', attributes, options);
}