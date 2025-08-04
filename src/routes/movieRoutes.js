// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/',protect,admin, createMovie);     // Admin only
router.put('/:id', protect, admin, updateMovie);   // Admin only
router.delete('/:id', protect, admin, deleteMovie); // Admin only

module.exports = router;