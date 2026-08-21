const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Snippet = require('./Snippet');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'comments',
    timestamps: true,
});

// Relacionamentos
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Snippet.hasMany(Comment, { foreignKey: 'snippetId' });
Comment.belongsTo(Snippet, { foreignKey: 'snippetId' });

module.exports = Comment;