import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import RecipeDetails from "./RecipeDetails";

function Home() {
  const [search, setSearch] = useState("");
  const [rec, setRec] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
        const result = await res.json();
        setRec(result.meals || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchRecipes();
    }, 500); // Simple debounce

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="App">
      <h2 className="p-3 text-center bg-light shadow-sm">Recipe Finder App</h2>

      <div className="d-flex justify-content-center mb-4 mt-3">
        <input
          type="text"
          placeholder="Search recipe here..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="ms-2" variant="primary">
          Search
        </Button>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-4 pt-2 pb-4">
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Finding delicious recipes...</p>
          </div>
        ) : error ? (
          <p className="text-danger mt-3">{error}</p>
        ) : rec.length === 0 ? (
          <p className="text-muted mt-3">No recipes found!</p>
        ) : (
          rec.map((meal) => (
            <div
              key={meal.idMeal}
              className="recipe-card border rounded p-3 shadow-sm bg-white"
              style={{
                width: "18rem",
              }}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="img-fluid rounded mb-2"
              />
              <h5 className="mt-2">{meal.strMeal}</h5>
              <p className="text-muted small">
                {meal.strArea} | {meal.strCategory}
              </p>

              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary mb-2 w-100"
              >
                ▶ Watch Recipe
              </a>
              
              <Link to={`/recipe/${meal.idMeal}`}>
                <Button className="w-100" variant="success" size="sm">
                  View Full Recipe
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ✅ Router setup
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
