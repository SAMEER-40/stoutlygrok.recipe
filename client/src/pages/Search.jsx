import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recipeService, authService } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './Search.css';

const Search = () => {
    const { user, updateUser } = useAuth();
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        cuisine: '',
        diet: '',
        type: ''
    });
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            const params = {
                q: query,
                ...filters,
                number: 12
            };
            const data = await recipeService.search(params);
            setRecipes(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
        }
        setLoading(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFavoriteToggle = async (recipe) => {
        if (!user) return;

        const isFav = user.favorites?.some(f => f.recipeId === recipe.id);

        try {
            if (isFav) {
                const updated = await authService.removeFavorite(recipe.id);
                updateUser({ favorites: updated });
            } else {
                const updated = await authService.addFavorite({
                    recipeId: recipe.id,
                    title: recipe.title,
                    image: recipe.image
                });
                updateUser({ favorites: updated });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const isFavorite = (recipeId) => {
        return user?.favorites?.some(f => f.recipeId === recipeId);
    };

    return (
        <div className="search-page">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for recipes (e.g., pasta, chicken, salad)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-btn">Search</button>
            </form>

            <div className="filters">
                <select name="cuisine" value={filters.cuisine} onChange={handleFilterChange}>
                    <option value="">All Cuisines</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                    <option value="indian">Indian</option>
                    <option value="american">American</option>
                </select>

                <select name="diet" value={filters.diet} onChange={handleFilterChange}>
                    <option value="">All Diets</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten free">Gluten Free</option>
                    <option value="ketogenic">Keto</option>
                </select>

                <select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="main course">Main Course</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="dessert">Dessert</option>
                    <option value="snack">Snack</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Searching...</div>
            ) : recipes.length > 0 ? (
                <div className="recipe-grid">
                    {recipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isFavorite={isFavorite(recipe.id)}
                            onFavoriteToggle={handleFavoriteToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>🔍 Search for your favorite recipes above</p>
                </div>
            )}
        </div>
    );
};

export default Search;
