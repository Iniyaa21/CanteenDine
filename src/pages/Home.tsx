import DishCard from "../components/DishCard";
import { useEffect, useState } from "react";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; description: string; imageUrl: string; no_of_times_ordered: number; price: number }[]>([]);
  const [dishes, setDishes] = useState<{ id: number; name: string; description: string; imageUrl: string; no_of_times_ordered: number; price: number }[]>([]);

  // Fetch dishes from the server
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("http://localhost:5000/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch dishes");
        }
        const data = await response.json();
        setDishes(data);
        setSearchResults(getTopDishes(data)); // Pass fetched data to getTopDishes
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, []);

  // Function to get top 10 dishes sorted by orders
  const getTopDishes = (dishesArray: typeof dishes) => {
    return [...dishesArray].sort((a, b) => b.no_of_times_ordered - a.no_of_times_ordered).slice(0, 10);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      // Reset to top 10 dishes if search query is empty
      setSearchResults(getTopDishes(dishes));
      return;
    }

    // Filter and sort dishes based on the search query
    const filteredResults = dishes
      .filter((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.no_of_times_ordered - a.no_of_times_ordered)
      .slice(0, 10);

    setSearchResults(filteredResults);
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for your favorite food!!!"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="dishes-grid">
        {searchResults.map((dish) => (
          <DishCard Dish={dish} key={dish.id} />
        ))}
      </div>
    </div>
  );
}

export default Home;