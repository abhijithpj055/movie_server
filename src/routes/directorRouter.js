const express = require('express');
const router = express.Router();
const {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} = require('../controllers/directorController');

const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getDirectors);
router.post('/', protect, admin, createDirector);
router.get('/:id', getDirectorById);
router.put('/:id', protect, admin, updateDirector);
router.delete('/:id', protect, admin, deleteDirector);

module.exports = router;
