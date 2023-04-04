const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, BlogPost, Comment } = require('../models');
const withAuth = require('../utils/auth');

// consolidated all non-api routes to homeRoutes.js, added and fixed some existing routes

/* need similar get route for /blogposts */
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

// create new blogpost form
router.get('/newpost', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: ['id', 'name']
        });
        res.render('blog', {
            logged_in: req.session.logged_in,
            user: userData.dataValues,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// shows all blogposts from logged_in user
router.get('/dashboard', withAuth, async (req, res) => {
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

// route so that you can search for all blogposts by a specific user
// in theory this should do the trick
router.get('/user/:id', withAuth, async (req, res) => {
    try {
        const userBlogPostData = await User.findByPk(req.params.id, {
            include: [
                {
                    model: BlogPost,
                    include: [Comment],
                },
            ],
            attributes: ['id', 'username']
        });

        const userBlogPosts = userBlogPostData.blogposts.map((blogpost) => blogpost.get({ plain: true }));
        console.log(userBlogPosts);

        res.render('single-user', {
            userBlogPosts,
            logged_in: req.session.logged_in,
            user: userBlogPostData.dataValues,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// loads specifc blogpost based on its ID
router.get('/blogposts/:id', async (req, res) => {
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

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;

// views needed:
/* 
main.handlebars
homepage.handlebars
dashboard.handlebars
login.handlebars
blog.handlebars
single-post.handlebars
single-user.handlebars 
*/
// all of these need to be created from scratch or redone