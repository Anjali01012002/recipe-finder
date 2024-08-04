import React from 'react';

function RecipeList({ recipes, onSave, onViewDetails }) {
  if (!recipes.length) return <p>No recipes found.</p>;

  return (
    <div className="row">
      {recipes.map((recipe) => (
        <div className="col-md-4 mb-4" key={recipe.id}>
          <div className="card">
            <img src={recipe.image} className="card-img-top" alt={recipe.title} />
            <div className="card-body">
              <h5 className="card-title">{recipe.title}</h5>
              <button className="btn btn-primary mr-2" onClick={() => onViewDetails(recipe.id)}>View Details</button>
              <button className="btn btn-secondary" onClick={() => onSave(recipe)}>Save</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
