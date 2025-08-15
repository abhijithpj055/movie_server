const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');

router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
