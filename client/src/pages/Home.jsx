import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeService, authService } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

const Home = () => {
    const { user, updateUser } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecipes();
    }, [user]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const params = { number: 8 };

            // Personalize based on user preferences
            if (user) {
                if (user.dietaryPreferences && user.dietaryPreferences !== 'None') {
                    params.diet = user.dietaryPreferences.toLowerCase();
                }
                if (user.preferredIngredients) {
                    params.includeIngredients = user.preferredIngredients;
                }
                if (user.avoidedIngredients) {
                    params.excludeIngredients = user.avoidedIngredients;
                }
            }

            const data = await recipeService.search(params);
            setRecipes(data.results || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
        setLoading(false);
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
        <div className="home">
            <section className="hero">
                <h1>
                    {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Cook Like a Pro, Eat Like a King'}
                </h1>
                <p>
                    {user
                        ? `Recipes tailored to your ${user.dietaryPreferences || 'taste'} preferences`
                        : 'Discover personalized recipes tailored to your taste and dietary needs'}
                </p>
                <Link to="/search" className="cta-button">
                    Start Cooking →
                </Link>
            </section>

            <section className="featured">
                <h2>{user ? 'Recommended For You' : 'Trending Recipes'}</h2>

                {loading ? (
                    <div className="loading">Loading delicious recipes...</div>
                ) : (
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
                )}
            </section>
        </div>
    );
};

export default Home;
