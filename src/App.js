import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import SavedRecipes from "./components/SavedRecipes";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

  useEffect(() => {
    const fetchDefaultRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?number=10&apiKey=${apiKey}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched default recipes:", data);
        setRecipes(data.results);
      } catch (error) {
        console.error("Error fetching default recipes:", error);
        setError("Failed to fetch default recipes");
      }
      setLoading(false);
    };

    fetchDefaultRecipes();

    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    setSavedRecipes(saved);
  }, []);

  const fetchRecipes = async (query, pageNumber) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&offset=${
          (pageNumber - 1) * 10
        }&apiKey=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched recipes:", data);
      setRecipes((prevRecipes) => [...prevRecipes, ...data.results]); // Append new recipes to the existing list
      setHasMore(data.results.length > 0); // Determine if there are more results
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Failed to fetch recipes");
    }
    setLoading(false);
  };

  const fetchRecipeDetails = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=75efe1046e304a8291bfb7246121bb9d`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched recipe details:", data);

      let nutrientsMap = {};
      if (data.nutrition && data.nutrition.nutrients) {
        nutrientsMap = data.nutrition.nutrients.reduce((map, nutrient) => {
          map[nutrient.name] = nutrient.amount;
          return map;
        }, {});
      }
      console.log("Nutrients map:", nutrientsMap);

      setSelectedRecipe({
        id: data.id,
        title: data.title,
        image: data.image,
        ingredients: data.extendedIngredients.map((ing) => ing.original),
        instructions: data.instructions,
        nutrition: {
          calories: nutrientsMap["Calories"] || "N/A",
          protein: nutrientsMap["Protein"] || "N/A",
          fat: nutrientsMap["Fat"] || "N/A",
          carbs: nutrientsMap["Carbohydrates"] || "N/A",
        },
      });
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setError("Failed to fetch recipe details");
    }
    setLoading(false);
  };

  const saveRecipe = (recipe) => {
    const newSavedRecipes = [...savedRecipes, recipe];
    setSavedRecipes(newSavedRecipes);
    localStorage.setItem("savedRecipes", JSON.stringify(newSavedRecipes));
  };

  const removeRecipe = (recipe) => {
    const newSavedRecipes = savedRecipes.filter((r) => r.id !== recipe.id);
    setSavedRecipes(newSavedRecipes);
    localStorage.setItem("savedRecipes", JSON.stringify(newSavedRecipes));
  };

  // Filter out saved recipes from the list
  const filteredRecipes = recipes.filter(
    (recipe) => !savedRecipes.some((saved) => saved.id === recipe.id)
  );

  const loadMoreRecipes = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchRecipes("", nextPage); // Fetch recipes with the next page number
      return nextPage;
    });
  };

  return (
    <div className="App container">
      <div className="row">
        <div className="col-md-8">
          <h1 className="my-4">Recipe Finder</h1>
          <SearchBar
            onSearch={(query) => {
              setRecipes([]); // Clear existing recipes
              setPage(1); // Reset page number
              fetchRecipes(query, 1); // Fetch recipes with the new query
            }}
          />
          {error && <p className="text-danger">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <InfiniteScroll
              dataLength={recipes.length}
              next={loadMoreRecipes}
              hasMore={hasMore}
              loader={<p>Loading more recipes...</p>}
              endMessage={<p>No more recipes to load</p>}
            >
              <RecipeList
                recipes={filteredRecipes}
                onSave={saveRecipe}
                onViewDetails={fetchRecipeDetails}
              />
            </InfiniteScroll>
          )}
          <RecipeDetails
            recipe={selectedRecipe}
            onHide={() => setSelectedRecipe(null)}
          />
        </div>
        <div className="col-md-4">
          <SavedRecipes recipes={savedRecipes} onRemove={removeRecipe} />
        </div>
      </div>
    </div>
  );
}

export default App;
