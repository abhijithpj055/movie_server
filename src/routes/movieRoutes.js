// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
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
router.post('/', protect, admin, upload.single('image'), createMovie);
router.put('/:id', protect, admin, upload.single('image'), updateMovie);
router.delete('/:id', protect, admin, deleteMovie); // Admin only

module.exports = router;