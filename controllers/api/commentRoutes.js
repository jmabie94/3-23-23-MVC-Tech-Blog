const router = require('express').Router();
const { Comment } = require('../../models');

router.post('/:id', async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No Comment Exists With This ID!' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const commentData = await Comment.update(
            {
                comment_text: req.body.comment_text,
            },
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id
                },
            }
        );

        if (!commentData) {
            res.status(404).json({ message: 'No Comment Exists With This ID!' });
            return;
        }
        
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;