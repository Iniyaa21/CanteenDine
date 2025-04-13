import { useEffect, useState } from "react";
import DishCard from "../components/DishCard";  // Assuming you have a DishCard component to display each dish
import "../css/Home.css";

type Dish = {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]); // State for storing dishes
  const [searchResults, setSearchResults] = useState<Dish[]>([]); // State for filtered dishes based on search query

  // Fetch dishes from the backend API (Flask)
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("http://localhost:5000/menu"); // Fetch dishes from backend
        if (!response.ok) {
          throw new Error("Failed to fetch dishes");
        }
        const data = await response.json();
        setDishes(data); // Store fetched dishes in state
        setSearchResults(getTopDishes(data)); // Get top dishes on initial load
      } catch (err) {
        console.error("Error fetching dishes:", err);
      }
    };
    fetchDishes();
  }, []);

  // Filter top dishes based on order count (or another criteria)
  const getTopDishes = (allDishes: Dish[]) => {
    return [...allDishes].slice(0, 8); // Adjust this logic to get top dishes based on your criteria
  };

  // Handle search functionality
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(getTopDishes(dishes)); // If search is empty, show top dishes
      return;
    }
    const filteredResults = dishes
      .filter((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 10); // Limit to top 10 matching results
    setSearchResults(filteredResults); // Set filtered results to display
  };

  return (
    <div className="home">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for your favorite food!!!"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Display dishes */}
      <div className="dishes-grid">
        {searchResults.length > 0 ? (
          searchResults.map((dish) => (
            <DishCard key={dish._id} dish={dish} />  // Rendering each dish using DishCard component
          ))
        ) : (
          <p>No dishes found</p>  // Display message if no dishes found
        )}
      </div>
    </div>  // This closing tag was misplaced, moved it correctly here
  );
}

export default Home;