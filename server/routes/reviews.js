const express = require('express');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/:recipeId
// @desc    Get reviews for a recipe
// @access  Public
router.get('/:recipeId', async (req, res) => {
    try {
        const reviews = await Review.find({ recipeId: req.params.recipeId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        res.json({
            reviews,
            averageRating: avgRating.toFixed(1),
            totalReviews: reviews.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { recipeId, rating, comment } = req.body;

        // Check if user already reviewed this recipe
        const existingReview = await Review.findOne({ user: req.user._id, recipeId });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this recipe' });
        }

        const review = await Review.create({
            user: req.user._id,
            recipeId,
            rating,
            comment
        });

        // Populate user name for response
        await review.populate('user', 'name');

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Not authorized to delete this review' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
