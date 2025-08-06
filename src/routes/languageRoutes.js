const express = require('express');
const router = express.Router();
const {
  createLanguage,
  getLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
} = require('../controllers/languageController');

const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getLanguages);
router.post('/', protect, admin, createLanguage);
router.get('/:id', getLanguageById);
router.put('/:id', protect, admin, updateLanguage);
router.delete('/:id', protect, admin, deleteLanguage);

module.exports = router;
