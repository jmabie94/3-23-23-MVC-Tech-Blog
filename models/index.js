const BlogPost = require('./BlogPost');
const User = require('./User');
const Comment = require('./Comment');

User.hasMany(BlogPost, {
    foreignKey: 'user_id',
});

BlogPost.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
});

Comment.belongsTo(BlogPost, {
    foreignKey: 'post_id',
    onDelete: 'SET NULL',
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL',
});

BlogPost.hasMany(Comment, {
    foreignKey: 'post_id',
});

module.exports = { User, BlogPost, Comment };