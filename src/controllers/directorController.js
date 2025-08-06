const Director = require('../models/directorModel');

// Create Director
const createDirector = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Director.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: 'Director already exists' });

    const director = new Director({ name: name.trim() });
    const saved = await director.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create director', error: err.message });
  }
};

// Get all Directors
const getDirectors = async (req, res) => {
  try {
    const directors = await Director.find();
    res.json(directors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch directors', error: err.message });
  }
};

// Get one Director by id
const getDirectorById = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (!director) return res.status(404).json({ message: 'Director not found' });
    res.json(director);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch director', error: err.message });
  }
};

// Update Director
const updateDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (!director) return res.status(404).json({ message: 'Director not found' });

    director.name = req.body.name?.trim() || director.name;
    const updated = await director.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update director', error: err.message });
  }
};

// Delete Director
const deleteDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (!director) return res.status(404).json({ message: 'Director not found' });

    await director.deleteOne();
    res.json({ message: 'Director deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete director', error: err.message });
  }
};

module.exports = {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
};
