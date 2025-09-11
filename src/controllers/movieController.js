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
    const {
      title,
      description,
      release_date,
      director,
      actors = [],
      language,
      rating,
      isPremium,
    } = req.body;

    const image = req.file ? req.file.path : null;

    const movie = new Movie({
      title,
      description,
      release_date,
      director,   // expecting ObjectId
      actors,     // expecting array of ObjectIds
      language,   // expecting ObjectId
      rating,
      isPremium,
      image,
      createdBy: req.user ? req.user._id : null,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Failed to create movie', error: error.message });
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
