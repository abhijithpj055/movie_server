const Language = require('../models/languageModel');

const createLanguage = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Language.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: 'Language already exists' });

    const lang = new Language({ name: name.trim() });
    const saved = await lang.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create language', error: err.message });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Language not found' });

    language.name = req.body.name?.trim() || language.name;
    const updated = await language.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update language', error: err.message });
  }
};

module.exports = {
  createLanguage,
  getLanguages: async (req,res)=>res.json(await Language.find()),
  getLanguageById: async (req,res)=>{
    const l = await Language.findById(req.params.id);
    if (!l) return res.status(404).json({ message:"Not found"});
    res.json(l);
  },
  updateLanguage,
  deleteLanguage: async (req,res)=>{
    const l= await Language.findById(req.params.id);
    if(!l) return res.status(404).json({ message:"Not found"});
    await l.deleteOne();
    res.json({ message:"Language deleted"});
  }
}
