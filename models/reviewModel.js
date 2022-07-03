const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {

    const Review = sequelize.define("review", {
        rating: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.TEXT
        }
    })

    return Review

}