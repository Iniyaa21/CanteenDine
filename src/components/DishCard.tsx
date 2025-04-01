import "../css/DishCard.css"
type Dish = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
};

function DishCard({ Dish }: { Dish: Dish }) {
    function onAddToCart() {
        alert("Clicked");
    }

    return (
        <div className="dish-card">
            <div className="dish-image">
                <img src={Dish.imageUrl} alt={Dish.name} />
                <div className="dish-overlay">
                    <button className="add-to-cart" onClick={onAddToCart}>Add to Cart</button>
                </div>
            </div>
            <div className="dish-info">
                <h2>{Dish.name}</h2>
                <p>{Dish.description}</p>
            </div>
        </div>
    );
}

export default DishCard;