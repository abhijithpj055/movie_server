const Comment = require('../models/commentModel');
const Review = require('../models/reviewModel');

// GET /api/reviews/:reviewId/comments
// Get all comments for a review
exports.getCommentsByReview = async (req, res) => {
  try {
    const comments = await Comment.find({ review_id: req.params.reviewId })
      .populate('user_id', 'name profile_pic') // 👈 include name & pic from user
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch comments',
      error: err.message
    });
  }
};

// POST /api/reviews/:reviewId/comments
// Add a comment to a review
exports.createComment = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    // Optional: check if review exists
    const reviewExists = await Review.findById(req.params.reviewId);
    if (!reviewExists) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const comment = new Comment({
      review_id: req.params.reviewId,
      user_id: req.user._id,
      content
    });

    const savedComment = await comment.save();

    // Populate user info in response
    await savedComment.populate('user_id', 'name profile_pic');

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to create comment',
      error: err.message
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Allow if: user owns the comment OR is admin
    if (
      comment.user_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};



// PUT /api/reviews/:reviewId/comments/:commentId
exports.updateComment = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    await comment.save();

    await comment.populate('user_id', 'name profile_pic');
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};
