const Language = require('../models/languageModel');

const createLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!language) return res.status(400).json({ message: 'Language is required' });

    const existing = await Language.findOne({ language: language.trim() });
    if (existing) return res.status(400).json({ message: 'Language already exists' });

    const lang = new Language({ language: language.trim() });
    const saved = await lang.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create language', error: err.message });
  }
};

const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch languages', error: err.message });
  }
};

const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Language not found' });
    res.json(language);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch language', error: err.message });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Language not found' });

    language.language = req.body.language?.trim() || language.language;
    const updated = await language.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update language', error: err.message });
  }
};

const deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Language not found' });

    await language.deleteOne();
    res.json({ message: 'Language deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete language', error: err.message });
  }
};

module.exports = {
  createLanguage,
  getLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
};
