const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, BlogPost } = require('../models');

router.get('/', async (req, res) => {
    try {
        const dbBlogPostData = await BlogPost.findAll({
            include: [
                {
                    model: BlogPost,
                    attributes: ['title', 'content'],
                },
            ],
        });

        const blogposts = dbBlogPostData.map((blogpost) => blogpost.get({ plain: true }));

        res.render('homepage', {
            blogposts,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const dbUserData = await User.findByPk(req.params.id, {
            include: [
                {
                    model: BlogPost,
                    attributes: [
                        'id',
                        'title',
                        'content',
                    ],
                },
            ],
        });

        const user = dbUserData.get({ plain: true });
        res.render('user', { user });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/blogpost/:id', async (req, res) => {
    try {
        const dbBlogPostData = await BlogPost.findByPk(req.params.id);

        const blogpost = dbBlogPostData.get({ plain: true });

        res.render('blogpost', { blogpost });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;