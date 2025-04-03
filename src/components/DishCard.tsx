import "../css/DishCard.css";

type Dish = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
};

function DishCard({ Dish }: { Dish: Dish }) {
    function onAddToCart() {
        alert(`${Dish.name} added to cart!`);
    }

    return (
        <div className="dish-card">
            <div className="dish-poster">
                <img src={Dish.imageUrl} alt={Dish.name} />
                <div className="dish-overlay">
                    <button className="cart-btn" onClick={onAddToCart}>
                        +
                    </button>
                </div>
            </div>
            <div className="dish-info">
                <h3>{Dish.name}</h3>
                <p>{Dish.description}</p>
            </div>
        </div>
    );
}

export default DishCard;