const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router.get('/', getAllReviews); // Public
router.post('/', protect, createReview); // Protected
router.put('/:id', protect, updateReview); // Protected
router.delete('/:id', protect, deleteReview); // Protected

module.exports = router;
