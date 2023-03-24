const router = require('express').Router();
const { BlogPost, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const allUserPosts = await BlogPost.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id', 'title', 'description', 'created_at', 'user_id'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
            ],
        });
        
        const blogposts = [];

        if (allUserPosts.length == 1) {
            const title = allUserPosts[0].dataValues.title;
            const description = allUserPosts[0].dataValues.description;
            const date = allUserPosts[0].dataValues.created_at;
            const postId = allUserPosts[0].dataValues.id;
            blogposts.push({ postId, title, description, date });
        } else {
            allUserPosts.forEach((blogpost) => {
                const title = blogpost.dataValues.title;
                const description = blogpost.dataValues.description;
                const date = blogpost.dataValues.created_at;
                const postId = blogpost.dataValues.id;
                blogposts.push({ postId, title, description, date });
            });
        }

        blogposts.reverse();

        res.render('dashboard', {
            blogposts,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;