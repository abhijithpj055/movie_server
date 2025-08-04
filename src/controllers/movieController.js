// controllers/movieController.js
const Movie = require('../models/movieModel');

const getMovies = async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
};

const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

const createMovie = async (req, res) => {
  const { title, description, image, release_date } = req.body;
  const movie = new Movie({
    title,
    description,
    image,
    release_date,
    createdBy: req.user._id
  });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
};

const updateMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    movie.image = req.body.image || movie.image;
    movie.release_date = req.body.release_Date || movie.release_date;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

const deleteMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    await Movie.findByIdAndDelete(req.params.id);

    res.json({ message: 'Movie removed' });
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };