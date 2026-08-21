const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Snippet = sequelize.define('Snippet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    aiStatus: {
        type: DataTypes.ENUM('pendente', 'analisando', 'concluido', 'erro'),
        defaultValue: 'pendente',
    },
    aiScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    aiFeedback: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('aiFeedback');
            if (typeof rawValue === 'string') {
                try {
                    return JSON.parse(rawValue);
                } catch (e) {
                    return rawValue;
                }
            }
            return rawValue;
        },
    },
}, {
    tableName: 'snippets',
    timestamps: true,
});

User.hasMany(Snippet, { foreignKey: 'userId' });
Snippet.belongsTo(User, { foreignKey: 'userId' });

module.exports = Snippet;