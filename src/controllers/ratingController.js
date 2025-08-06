const Rating = require('../models/ratingModel');
const Movie = require('../models/movieModel');

exports.submitRating = async (req, res) => {
  const { score } = req.body;
  const userId = req.user._id;
  const movieId = req.params.movieId;

  if (score === undefined || score < 0 || score > 5) {
    return res.status(400).json({ message: 'Score must be between 0 and 5' });
  }

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Check if user already rated
    let existingRating = await Rating.findOne({ user_id: userId, movie_id: movieId });

    if (existingRating) {
      existingRating.score = score;
      await existingRating.save();
    } else {
      existingRating = new Rating({ user_id: userId, movie_id: movieId, score });
      await existingRating.save();
    }

    // Recalculate average and count
    const allRatings = await Rating.find({ movie_id: movieId });
    const totalScore = allRatings.reduce((acc, rating) => acc + rating.score, 0);
    const avg = totalScore / allRatings.length;

    movie.averageRating = avg;
    movie.numberOfRatings = allRatings.length;
    await movie.save();

    res.status(200).json({
      message: 'Rating submitted successfully',
      averageRating: avg.toFixed(2),
      numberOfRatings: allRatings.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};
