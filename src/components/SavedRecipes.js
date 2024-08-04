
import React from 'react';

function SavedRecipes({ recipes, onRemove }) {
  return (
    <div className="saved-recipes">
      <h2>Saved Recipes</h2>
      {recipes.length === 0 ? (
        <p>No saved recipes.</p>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div className="col-md-12 mb-4" key={recipe.id}>
              <div className="card">
                <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <button className="btn btn-danger" onClick={() => onRemove(recipe)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedRecipes;
