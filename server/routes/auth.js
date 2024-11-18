const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, skillLevel, dietaryPreferences, allergies } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Please enter a valid email' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            skillLevel,
            dietaryPreferences,
            allergies
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            skillLevel: user.skillLevel,
            dietaryPreferences: user.dietaryPreferences,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user and include password
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            skillLevel: user.skillLevel,
            dietaryPreferences: user.dietaryPreferences,
            allergies: user.allergies,
            preferredIngredients: user.preferredIngredients,
            avoidedIngredients: user.avoidedIngredients,
            favorites: user.favorites,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, skillLevel, dietaryPreferences, allergies, preferredIngredients, avoidedIngredients } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, skillLevel, dietaryPreferences, allergies, preferredIngredients, avoidedIngredients },
            { new: true, runValidators: true }
        );

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/auth/favorites
// @desc    Add recipe to favorites
// @access  Private
router.post('/favorites', protect, async (req, res) => {
    try {
        const { recipeId, title, image } = req.body;

        // Check if already favorited
        const alreadyFav = req.user.favorites.find(f => f.recipeId === recipeId);
        if (alreadyFav) {
            return res.status(400).json({ error: 'Recipe already in favorites' });
        }

        req.user.favorites.push({ recipeId, title, image });
        await req.user.save();

        res.json(req.user.favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   DELETE /api/auth/favorites/:recipeId
// @desc    Remove recipe from favorites
// @access  Private
router.delete('/favorites/:recipeId', protect, async (req, res) => {
    try {
        req.user.favorites = req.user.favorites.filter(
            f => f.recipeId !== parseInt(req.params.recipeId)
        );
        await req.user.save();

        res.json(req.user.favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
