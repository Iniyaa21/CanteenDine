import DishCard from "../components/DishCard";
import { useEffect, useState } from "react";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; description: string; imageUrl: string; orders: number; price: number}[]>([]);

  const dishes = [
    { id: 1, name: "Pizza", description: "Delicious cheese pizza", imageUrl: "/images/pizza.jpg", orders: 120, price: 10 },
    { id: 2, name: "Burger", description: "Juicy beef burger with lettuce", imageUrl: "/images/burger.jpg", orders: 95, price: 20 },
    { id: 3, name: "Pasta", description: "Creamy Alfredo pasta", imageUrl: "/images/pasta.jpg", orders: 80, price: 15 },
    { id: 4, name: "Salad", description: "Fresh garden salad with vinaigrette", imageUrl: "/images/salad.jpg", orders: 60, price: 8 },
    { id: 5, name: "Sushi", description: "Assorted sushi rolls", imageUrl: "/images/sushi.jpg", orders: 150, price: 25 },
    { id: 14, name: "Pancakes", description: "Fluffy pancakes with syrup", imageUrl: "pancake.jpg", orders: 165, price: 12 },
    { id: 15, name: "Brownie", description: "Chocolate brownie with nuts", imageUrl: "/images/brownie.jpg", orders: 155, price: 5 },
  ];

  // Function to get top 10 dishes sorted by orders
  const getTopDishes = () => {
    return [...dishes].sort((a, b) => b.orders - a.orders).slice(0, 8);
  };

  useEffect(() => {
    // Set initial top 10 dishes on page load
    setSearchResults(getTopDishes());
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      // Reset to top 10 dishes if search query is empty
      setSearchResults(getTopDishes());
      return;
    }

    // Filter and sort dishes based on the search query
    const filteredResults = dishes
      .filter((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.orders - a.orders)
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