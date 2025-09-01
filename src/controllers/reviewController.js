const review = require('../models/reviewModel');

// GET /api/reviews - Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await review.find()
      .populate('user_id', 'name')
      .populate('movie_id', 'title');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// POST /api/reviews - Create a new review
exports.createReview = async (req, res) => {
  const { movie_id, rating, comment } = req.body;

  try {
    // Prevent duplicate review by same user
    // const existingReview = await review.findOne({ user_id: req.user._id, movie_id });
    // if (existingReview) {
    //   return res.status(400).json({ message: 'You have already reviewed this movie.' });
    // }

    const newReview = new review({
      user_id: req.user._id,
      movie_id,
      rating,
      comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

// PUT /api/reviews/:id - Update a review
exports.updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const reviews = await review.findById(req.params.id);
    if (!reviews) return res.status(404).json({ message: 'Review not found' });

    if (reviews.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    reviews.rating = rating ?? reviews.rating;
    reviews.comment = comment ?? reviews.comment;

    const updated = await reviews.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
};

// DELETE /api/reviews/:id - Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviews = await review.findById(req.params.id);
    if (!reviews) return res.status(404).json({ message: 'Review not found' });

    if (reviews.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await reviews.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
