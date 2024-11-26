import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeService, reviewService, authService } from '../services/api';
import './RecipeDetails.css';

const RecipeDetails = () => {
    const { id } = useParams();
    const { user, updateUser } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [reviews, setReviews] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchRecipe();
        fetchReviews();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const data = await recipeService.getById(id);
            setRecipe(data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
        setLoading(false);
    };

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getByRecipe(id);
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to review');

        try {
            await reviewService.add({
                recipeId: parseInt(id),
                rating: parseInt(reviewForm.rating),
                comment: reviewForm.comment
            });
            setReviewForm({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            alert(error.response?.data?.error || 'Error posting review');
        }
    };

    const handleFavoriteToggle = async () => {
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

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    const isFavorite = user?.favorites?.some(f => f.recipeId === recipe.id);

    return (
        <div className="recipe-details">
            <div className="recipe-hero" style={{ backgroundImage: `url(${recipe.image})` }}>
                <div className="hero-overlay">
                    <h1>{recipe.title}</h1>
                    <div className="meta">
                        <span>⏱️ {recipe.readyInMinutes} min</span>
                        <span>👥 {recipe.servings} servings</span>
                        {reviews.totalReviews > 0 && (
                            <span>⭐ {reviews.averageRating} ({reviews.totalReviews} reviews)</span>
                        )}
                    </div>
                    {user && (
                        <button onClick={handleFavoriteToggle} className="fav-btn">
                            {isFavorite ? '❤️ Saved' : '🤍 Save Recipe'}
                        </button>
                    )}
                </div>
            </div>

            <div className="recipe-content">
                <div className="main-content">
                    <section className="summary">
                        <h2>About</h2>
                        <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                    </section>

                    <section className="ingredients">
                        <h2>Ingredients</h2>
                        <ul>
                            {recipe.extendedIngredients?.map((ing, i) => (
                                <li key={i}>{ing.original}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="instructions">
                        <h2>Instructions</h2>
                        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                    </section>

                    {recipe.nutrition?.nutrients && (
                        <section className="nutrition">
                            <h2>Nutrition (per serving)</h2>
                            <div className="nutrition-grid">
                                {recipe.nutrition.nutrients
                                    .filter(n => ['Calories', 'Protein', 'Carbohydrates', 'Fat'].includes(n.name))
                                    .map(n => (
                                        <div key={n.name} className="nutrient">
                                            <span className="value">{Math.round(n.amount)}{n.unit}</span>
                                            <span className="label">{n.name}</span>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="sidebar">
                    <section className="reviews-section">
                        <h2>Reviews</h2>

                        {user && (
                            <form onSubmit={handleReviewSubmit} className="review-form">
                                <select
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: e.target.value }))}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                    <option value="4">⭐⭐⭐⭐ Great</option>
                                    <option value="3">⭐⭐⭐ Good</option>
                                    <option value="2">⭐⭐ Fair</option>
                                    <option value="1">⭐ Poor</option>
                                </select>
                                <textarea
                                    placeholder="Share your experience..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    required
                                />
                                <button type="submit">Post Review</button>
                            </form>
                        )}

                        <div className="reviews-list">
                            {reviews.reviews.length === 0 ? (
                                <p className="no-reviews">No reviews yet. Be the first!</p>
                            ) : (
                                reviews.reviews.map(review => (
                                    <div key={review._id} className="review">
                                        <div className="review-header">
                                            <strong>{review.user?.name || 'Anonymous'}</strong>
                                            <span>{'⭐'.repeat(review.rating)}</span>
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default RecipeDetails;
