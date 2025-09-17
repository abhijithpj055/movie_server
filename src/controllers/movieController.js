const Movie = require('../models/movieModel');
const cloudinary = require('../config/cloudinary');

// ----------------- Helper to handle actors safely -----------------
const parseActors = (actors) => {
  if (!actors) return [];
  if (Array.isArray(actors)) return actors;
  if (typeof actors === 'string') {
    try {
      return JSON.parse(actors); // if frontend sent JSON string
    } catch {
      return [actors]; // single string id
    }
  }
  return [];
};

// ----------------- GET ALL -----------------
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('director', 'name')
      .populate('actors', 'name')
      .populate('language', 'name');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- GET BY ID -----------------
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('director', 'name')
      .populate('actors', 'name')
      .populate('language', 'name');
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- CREATE -----------------
const createMovie = async (req, res) => {
  try {
        console.log("Incoming movie request:", req.body);

    const {
      title,
      description,
      release_date,
      director,
      actors,
      language,
      rating,
      isPremium,
    } = req.body;

    console.log("📥 Incoming Create Movie Request");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user?._id);

    const movieData = {
      title,
      description,
      release_date,
      director,
      actors: parseActors(actors),
      language,
      rating,
      isPremium: String(isPremium) === 'true',
      createdBy: req.user?._id,
    };

    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: 'movies',
    //   });
    //   movieData.image = result.secure_url;
    // }

    const movie = new Movie(movieData);
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error("❌ Backend Error:", error);

    res.status(500).json({
      message: "Failed to create movie",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ----------------- UPDATE -----------------
const updateMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      release_date,
      director,
      actors,
      language,
      rating,
      isPremium,
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(release_date && { release_date }),
      ...(director && { director }),
      ...(language && { language }),
      ...(rating && { rating }),
      ...(isPremium !== undefined && { isPremium: String(isPremium) === 'true' }),
    };

    if (actors) {
      updateData.actors = parseActors(actors);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'movies',
      });
      updateData.image = result.secure_url;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (updatedMovie) {
      res.json(updatedMovie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error("❌ Error updating movie:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ----------------- DELETE -----------------
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      await movie.deleteOne();
      res.json({ message: 'Movie removed' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
