import DishCard from "../components/DishCard";
import { useState } from "react";
import "../css/Home.css"
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const dishes = [
    {
      id: 1,
      name: "Pizza",
      description: "Delicious cheese pizza",
      imageUrl: "/images/pizza.jpg",
    },
    {
      id: 2,
      name: "Burger",
      description: "Juicy beef burger with lettuce",
      imageUrl: "/images/burger.jpg",
    },
    {
      id: 3,
      name: "Pasta",
      description: "Creamy Alfredo pasta",
      imageUrl: "/images/pasta.jpg",
    },
  ];


const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert("Hello World");
    setSearchQuery("")
};
  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for you fav food!!!"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="dishes-grid">
        {dishes.map((dish) => (
          <DishCard Dish={dish} key={dish.id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
