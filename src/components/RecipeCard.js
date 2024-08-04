
import React from 'react';

function RecipeCard({ recipe, onSave, onViewDetails }) {
  return (
    <div className="card my-3">
      <img src={recipe.image} alt={recipe.title} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{recipe.title}</h5>
        <button onClick={() => onViewDetails(recipe.id)} className="btn btn-info mr-2">View Details</button>
        <button onClick={() => onSave(recipe)} className="btn btn-success">Save</button>
      </div>
    </div>
  );
}

export default RecipeCard;
