const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Product = sequelize.define("product", {
        image: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        published: {
            type: DataTypes.BOOLEAN
        }

    })

    return Product

}

