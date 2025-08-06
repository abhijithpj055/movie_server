const Actor = require('../models/actorModel');

const createActor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Actor.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: 'Actor already exists' });

    const actor = new Actor({ name: name.trim() });
    const saved = await actor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create actor', error: err.message });
  }
};

const getActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch actors', error: err.message });
  }
};

const getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ message: 'Actor not found' });
    res.json(actor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch actor', error: err.message });
  }
};

const updateActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ message: 'Actor not found' });

    actor.name = req.body.name?.trim() || actor.name;
    const updated = await actor.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update actor', error: err.message });
  }
};

const deleteActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) return res.status(404).json({ message: 'Actor not found' });

    await actor.deleteOne();
    res.json({ message: 'Actor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete actor', error: err.message });
  }
};

module.exports = {
  createActor,
  getActors,
  getActorById,
  updateActor,
  deleteActor,
};
