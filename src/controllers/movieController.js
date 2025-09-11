const mongoose = require('mongoose');

const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel');

// ----------------- GET ALL -----------------
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('director', 'name')
      .populate('actors', 'name')
      .populate('language', 'name');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};

// ----------------- GET BY ID -----------------
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('director', 'name')
      .populate('actors', 'name')
      .populate('language', 'name');

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const reviews = await Review.find({ movie_id: movie._id }).populate('user_id', 'name');

    res.json({ ...movie.toObject(), reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

// ----------------- CREATE -----------------
const createMovie = async (req, res) => {
  try {
    console.log("Incoming movie request:");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user?._id);

    const { title, description, release_date, director, actors, language, rating, isPremium } = req.body;

    // ✅ Basic validation
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: no user info" });
    }
    if (!title || !description || !release_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Build initial movie data
    const movieData = {
      title,
      description,
      release_date: new Date(release_date),
      rating: rating ? Number(rating) : 0,
      isPremium: isPremium === 'true' || isPremium === true,
      image: req.file ? req.file.path : null,
      createdBy: req.user._id,
    };

    // ✅ Parse and validate actors
    try {
      movieData.actors = typeof actors === 'string'
        ? JSON.parse(actors)
        : Array.isArray(actors)
        ? actors
        : [];

      movieData.actors = movieData.actors.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
    } catch (err) {
      return res.status(400).json({ message: 'Invalid actors format' });
    }

    // ✅ Validate and assign director
    if (director && mongoose.Types.ObjectId.isValid(director)) {
      movieData.director = director;
    } else if (director) {
      return res.status(400).json({ message: 'Invalid director ID' });
    }

    // ✅ Validate and assign language
    if (language && mongoose.Types.ObjectId.isValid(language)) {
      movieData.language = language;
    } else if (language) {
      return res.status(400).json({ message: 'Invalid language ID' });
    }

    // ✅ Save to DB
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();

    res.status(201).json(savedMovie);

  } catch (error) {
    console.error("❌ Error creating movie:", error);
    res.status(500).json({
      message: "Failed to create movie",
      error: error.message,
      name: error.name,
      stack: error.stack,
      errors: error.errors || null,
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
      ...(rating !== undefined && { rating }),
      ...(isPremium !== undefined && { isPremium }),
      ...(actors && { actors }),
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });

    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Failed to update movie', error: error.message });
  }
};

// ----------------- DELETE -----------------
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete movie', error: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
