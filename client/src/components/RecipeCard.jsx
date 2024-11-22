import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite }) => {
    const { user } = useAuth();

    return (
        <div className="recipe-card">
            <Link to={`/recipe/${recipe.id}`}>
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.title}</h3>
                </div>
            </Link>
            {user && (
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onFavoriteToggle(recipe);
                    }}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            )}
        </div>
    );
};

export default RecipeCard;
