const express = require('express');
const router = express.Router();
const {
  createActor,
  getActors,
  getActorById,
  updateActor,
  deleteActor,
} = require('../controllers/actorController');

const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getActors);
router.post('/', protect, admin, createActor);
router.get('/:id', getActorById);
router.put('/:id', protect, admin, updateActor);
router.delete('/:id', protect, admin, deleteActor);

module.exports = router;
