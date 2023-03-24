const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, BlogPost, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
        const dbBlogPostData = await BlogPost.findAll(
            {
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
                    {
                        model: User,
                        attributes: ['username'],
                    },
                ],
            }
        );

        const blogposts = dbBlogPostData.map((blogpost) => blogpost.get({ plain: true }));

        blogposts.reverse();

        res.render('homepage', {
            blogposts,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// route so that you can search for all blogposts by a specific user
// !!!!!!!!! needs finishing !!!!!!!!
/* router.get('/user/:id', async (req, res) => {
    try {
        const dbUserData = await User.findByPk(req.params.id, {
            include: [
                {
                    model: BlogPost,
                    attributes: ['id', 'title', 'description', 'created_at', 'user_id'],
                    include: {
                        model: U
                    }
                }
            ]
        })
    }
}) */

router.get('/blogpost/:id', async (req, res) => {
    try {
        const dbBlogPostData = await BlogPost.findOne({
            where: {
                id: req.params.id,
            },
            atttributes: ['id', 'title', 'description', 'user_id', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const title = dbBlogPostData.dataValues.title;
        const user = dbBlogPostData.dataValues.user.username;
        const date = dbBlogPostData.dataValues.created_at;
        const description = dbBlogPostData.dataValues.description;
        const post = {
            title,
            date,
            user,
            description,
            comments: [],
        };

        for (let i = 0; i < dbBlogPostData.dataValues.comments.length; i++ ) {
            let username = dbBlogPostData.dataValues.comments[i].user.username;
            let commentText = dbBlogPostData.dataValues.comments[i].comment_text;
            let commentDate = dbBlogPostData.dataValues.comments[i].dataValues.created_at;
            let userId = dbBlogPostData.dataValues.comments[i].dataValues.user_id;
            let commentId = dbBlogPostData.dataValues.comments[i].dataValues.id;

            post.comments.push({
                user: username,
                userId: userId,
                text: commentText,
                date: commentDate,
                commentId: commentId,
                usersComment: username == req.session.username,
            });
        };

        res.render('single-post', {
            post,
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    };
});

module.exports = router;