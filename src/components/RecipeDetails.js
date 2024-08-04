import React from 'react';

function RecipeDetails({ recipe, onHide }) {
  if (!recipe) return null;

  const renderIngredients = () => {
    return recipe.ingredients.map((ingredient, index) => (
      <li key={index}>{ingredient}</li>
    ));
  };

  const renderInstructions = () => {
    return { __html: recipe.instructions };
  };

  const nutrition = recipe.nutrition || {};
  const calories = nutrition.calories !== 'N/A' ? `${nutrition.calories} kcal` : 'N/A';
  const protein = nutrition.protein !== 'N/A' ? `${nutrition.protein} g` : 'N/A';
  const fat = nutrition.fat !== 'N/A' ? `${nutrition.fat} g` : 'N/A';
  const carbs = nutrition.carbs !== 'N/A' ? `${nutrition.carbs} g` : 'N/A';

  return (
    <div className={`modal fade ${recipe ? 'show' : ''}`} style={{ display: recipe ? 'block' : 'none' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{recipe.title}</h5>
            <button type="button" className="close" onClick={onHide}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <img src={recipe.image} alt={recipe.title} className="img-fluid mb-3" />
            <h5>Ingredients</h5>
            <ul>
              {renderIngredients()}
            </ul>
            <h5>Instructions</h5>
            <div dangerouslySetInnerHTML={renderInstructions()} />
            <h5>Nutrition Information</h5>
            <ul>
              <li>Calories: {calories}</li>
              <li>Protein: {protein}</li>
              <li>Fat: {fat}</li>
              <li>Carbs: {carbs}</li>
            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
