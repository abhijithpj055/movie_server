const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { submitRating } = require('../controllers/ratingController');

// POST /api/movies/:movieId/rate
router.post('/:movieId/rate', protect, submitRating);

module.exports = router;
