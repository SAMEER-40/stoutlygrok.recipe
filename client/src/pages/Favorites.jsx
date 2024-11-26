import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Favorites.css';

const Favorites = () => {
    const { user, updateUser } = useAuth();

    if (!user) {
        return (
            <div className="favorites-page">
                <div className="empty-state">
                    <h2>Please login to view favorites</h2>
                    <Link to="/login" className="login-btn">Login</Link>
                </div>
            </div>
        );
    }

    const handleRemove = async (recipeId) => {
        try {
            const updated = await authService.removeFavorite(recipeId);
            updateUser({ favorites: updated });
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <div className="favorites-page">
            <h1>Your Saved Recipes</h1>
            <p className="subtitle">{user.favorites?.length || 0} recipes saved</p>

            {!user.favorites || user.favorites.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't saved any recipes yet.</p>
                    <Link to="/search" className="browse-btn">Browse Recipes</Link>
                </div>
            ) : (
                <div className="favorites-grid">
                    {user.favorites.map(fav => (
                        <div key={fav.recipeId} className="favorite-card">
                            <Link to={`/recipe/${fav.recipeId}`}>
                                <img src={fav.image} alt={fav.title} />
                                <div className="content">
                                    <h3>{fav.title}</h3>
                                </div>
                            </Link>
                            <button
                                onClick={() => handleRemove(fav.recipeId)}
                                className="remove-btn"
                            >
                                🗑️ Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
