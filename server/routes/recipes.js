const express = require('express');
const axios = require('axios');

const router = express.Router();

// In-memory cache
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

// @route   GET /api/recipes
// @desc    Search recipes from Spoonacular
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { q, cuisine, diet, type, maxReadyTime, includeIngredients, excludeIngredients, number = 12 } = req.query;

        let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&number=${number}`;

        if (q) url += `&query=${encodeURIComponent(q)}`;
        if (cuisine) url += `&cuisine=${cuisine}`;
        if (diet) url += `&diet=${diet}`;
        if (type) url += `&type=${type}`;
        if (maxReadyTime) url += `&maxReadyTime=${maxReadyTime}`;
        if (includeIngredients) url += `&includeIngredients=${encodeURIComponent(includeIngredients)}`;
        if (excludeIngredients) url += `&excludeIngredients=${encodeURIComponent(excludeIngredients)}`;

        // Check cache
        const cacheKey = url;
        if (cache.has(cacheKey)) {
            const { timestamp, data } = cache.get(cacheKey);
            if (Date.now() - timestamp < CACHE_TTL) {
                return res.json(data);
            }
        }

        const response = await axios.get(url);

        // Store in cache
        cache.set(cacheKey, { timestamp: Date.now(), data: response.data });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/recipes/:id
// @desc    Get recipe details from Spoonacular
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `recipe_${id}`;

        // Check cache
        if (cache.has(cacheKey)) {
            const { timestamp, data } = cache.get(cacheKey);
            if (Date.now() - timestamp < CACHE_TTL) {
                return res.json(data);
            }
        }

        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}&includeNutrition=true`;
        const response = await axios.get(url);

        // Store in cache
        cache.set(cacheKey, { timestamp: Date.now(), data: response.data });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
