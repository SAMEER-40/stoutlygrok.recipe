import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Profile.css';

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        skillLevel: user?.skillLevel || 'Beginner',
        dietaryPreferences: user?.dietaryPreferences || 'None',
        allergies: user?.allergies || '',
        preferredIngredients: user?.preferredIngredients || '',
        avoidedIngredients: user?.avoidedIngredients || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updated = await authService.updateProfile(formData);
            updateUser(updated);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Error updating profile');
        }
        setLoading(false);
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Skill Level</label>
                            <select name="skillLevel" value={formData.skillLevel} onChange={handleChange}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                                <option>Master Chef</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dietary Preferences</label>
                            <select name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleChange}>
                                <option>None</option>
                                <option>Vegetarian</option>
                                <option>Vegan</option>
                                <option>Pescatarian</option>
                                <option>Gluten Free</option>
                                <option>Keto</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Allergies (comma-separated)</label>
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="e.g., peanuts, shellfish"
                        />
                    </div>

                    <div className="form-group">
                        <label>Preferred Ingredients</label>
                        <input
                            type="text"
                            name="preferredIngredients"
                            value={formData.preferredIngredients}
                            onChange={handleChange}
                            placeholder="e.g., chicken, garlic, tomatoes"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ingredients to Avoid</label>
                        <input
                            type="text"
                            name="avoidedIngredients"
                            value={formData.avoidedIngredients}
                            onChange={handleChange}
                            placeholder="e.g., mushrooms, olives"
                        />
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
