import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button,Badge } from "react-bootstrap";

function RecipeDetails() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals && data.meals.length > 0) {
          setMeal(data.meals[0]);
        } else {
          setMeal(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setMeal(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading recipe details...</p>
      </div>
    );
  }

  if (!meal) {
    return <p className="text-center mt-4">Recipe not found!</p>;
  }

  return (
    <div className="container py-5">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">{meal.strMeal}</h2>
        <div>
          <Badge bg="info" className="me-2">{meal.strCategory}</Badge>
          <Badge bg="secondary">{meal.strArea}</Badge>
        </div>
      </div>

      {/* Layout */}
      <div className="row align-items-start">
        {/* Left side: Image + basic info */}
        <div className="col-md-5 text-center mb-4">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="img-fluid rounded shadow-lg mb-3"
            style={{ border: "4px solid #eee" }}
          />
          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="btn btn-danger w-100"
            >
              ▶ Watch on YouTube
            </a>
          )}
        </div>

        {/* Right side: Instructions + Ingredients */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="mb-3 text-primary">🧾 Instructions</h5>
            <p style={{ lineHeight: "1.6", textAlign: "justify" }}>
              {meal.strInstructions}
            </p>

            <hr />

            <h5 className="mb-3 text-success">🥕 Ingredients</h5>
            <ul className="list-group list-group-flush">
              {Array.from({ length: 20 }, (_, i) => i + 1)
                .map((i) => {
                  const ingredient = meal[`strIngredient${i}`];
                  const measure = meal[`strMeasure${i}`];
                  return ingredient ? (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{ingredient}</span>
                      <span className="text-muted">{measure}</span>
                    </li>
                  ) : null;
                })}
            </ul>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-5">
        <Link to="/">
          <Button variant="dark">⬅ Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default RecipeDetails;
