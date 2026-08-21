const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:snippetId', authMiddleware, commentController.create);
router.get('/:snippetId', commentController.listBySnippet);

module.exports = router;