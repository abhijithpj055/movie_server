const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middlewares/authMiddleware');
const {
  getCommentsByReview,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

// Public
router.get('/', getCommentsByReview);

// Protected
router.post('/', protect, createComment);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
