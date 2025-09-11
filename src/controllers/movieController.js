// // controllers/movieController.js
// const Movie = require('../models/movieModel');
// const Review = require('../models/reviewModel');

// const getMovies = async (req, res) => {
//   const movies = await Movie.find({});
//   res.json(movies);
// };

// const getMovieById = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id)
//       .populate("director", "name")
//       .populate("actors", "name")
//       .populate("language", "name");

//     if (!movie) {
//       return res.status(404).json({ message: "Movie not found" });
//     }

//     // fetch reviews for this movie
//     const reviews = await Review.find({ movie_id: movie._id })
//       .populate("user_id", "name");

//     res.json({
//       ...movie.toObject(),
//       reviews,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching movie", error: error.message });
//   }
// };

// module.exports = {
//   getMovieById,
//   // other functions (getMovies, createMovie, updateMovie, deleteMovie...)
// };


// const createMovie = async (req, res) => {
//   try {
//     let { title, description, release_date, director, actors, language, rating, isPremium } = req.body;

//         // Normalize actors
//     if (actors) {
//       if (typeof actors === "string") {
//         try {
//           actors = JSON.parse(actors);
//         } catch {
//           actors = [actors];
//         }
//       }
//       if (!Array.isArray(actors)) actors = [actors];
//     } else {
//       actors = [];
//     }
//     // Get the image URL from Cloudinary (uploaded by multer)
//     const image = req.file ? req.file.path : null;

//     const movie = new Movie({
//       title,
//       description,
//       release_date,
//       director,
//       actors,
//       language,
//       rating,
//       isPremium,
//       image,
//       createdBy: req.user ? req.user._id : null, // optional if you have auth
//     });

//     const createdMovie = await movie.save();
//     res.status(201).json(createdMovie);
//   } catch (error) {
//     console.error('Error creating movie:', error);
//     res.status(500).json({
//       message: 'Failed to create movie',
//       error: error.message,
//     });
//   }
// };


// const updateMovie = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) return res.status(404).json({ message: 'Movie not found' });

//     movie.title = req.body.title || movie.title;
//     movie.description = req.body.description || movie.description;
//     movie.release_date = req.body.release_date || movie.release_date;
//     movie.rating = req.body.rating ?? movie.rating;
//     movie.isPremium = req.body.isPremium ?? movie.isPremium;
//     movie.director = req.body.director || movie.director;
//     movie.language = req.body.language || movie.language;

//     // Handle actors array
//  if (req.body.actors) {
//   let actors = req.body.actors;
//   if (!Array.isArray(actors)) actors = [actors];
//   movie.actors = actors;
// }


//     // Only update image if a new file is uploaded
//     if (req.file) {
//       movie.image = req.file.path; 
//     }

//     const updatedMovie = await movie.save();
//     res.json(updatedMovie);
//   } catch (error) {
//     console.error('Error updating movie:', error);
//     res.status(500).json({ message: 'Failed to update movie', error: error.message });
//   }
// };


// const deleteMovie = async (req, res) => {
//   const movie = await Movie.findById(req.params.id);
//   if (movie) {
//     await Movie.findByIdAndDelete(req.params.id);

//     res.json({ message: 'Movie removed' });
//   } else {
//     res.status(404).json({ message: 'Movie not found' });
//   }
// };

// module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };



const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel');

// Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};

// Get movie by ID with populated fields and reviews
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

// Create new movie
const createMovie = async (req, res) => {
  try {
    let { title, description, release_date, director, actors, language, rating, isPremium } = req.body;
     
    // Normalize actors to array
    if (actors) {
      if (typeof actors === 'string') {
        try {
          actors = JSON.parse(actors);
        } catch {
          actors = [actors];
        }
      }
      if (!Array.isArray(actors)) actors = [actors];
    } else {
      actors = [];
    }

    const image = req.file ? req.file.path : null;

    const movie = new Movie({
      title,
      description,
      release_date,
      director,
      actors,
      language,
      rating,
      isPremium,
      image,
      createdBy: req.user ? req.user._id : null,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create movie', error: error.message });
  }
};

// Update existing movie
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    movie.release_date = req.body.release_date || movie.release_date;
    movie.rating = req.body.rating ?? movie.rating;
    movie.isPremium = req.body.isPremium ?? movie.isPremium;
    movie.director = req.body.director || movie.director;
    movie.language = req.body.language || movie.language;

    if (req.body.actors) {
      let actors = req.body.actors;
      if (typeof actors === 'string') {
        try {
          actors = JSON.parse(actors);
        } catch {
          actors = [actors];
        }
      }
      if (!Array.isArray(actors)) actors = [actors];
      movie.actors = actors;
    }

    if (req.file) {
      movie.image = req.file.path;
    }

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error: error.message });
  }
};

// Delete movie
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
