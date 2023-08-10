const express = require('express');
const router = express.Router();
const { createComment, deleteComment,getAllComments } = require('../controllers/comments');

router.post('/', createComment);
router.get('/:id', getAllComments);
router.delete('/:id', deleteComment);

module.exports = router;
