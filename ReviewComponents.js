// ReviewComponent.js
import React from 'react';
import './ReviewComponents.css'; // Import the CSS file

const ReviewComponent = ({ categories, onRatingChange }) => {
  const renderStars = (categoryIndex, rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? "text-warning" : "text-secondary"}
          style={{ cursor: 'pointer' }}
          onClick={() => onRatingChange(categoryIndex, i + 1)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-container">
      {categories.map((category, index) => (
        <div key={index} className="review-row">
          <div className="category-name">{category.name}</div>
          <div className="stars">{renderStars(index, category.rating)}</div>
        </div>
      ))}
    </div>
  );
};

export default ReviewComponent;