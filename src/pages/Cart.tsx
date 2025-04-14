import { useEffect, useState } from "react";
import "../css/Cart.css";

type CartItem = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    quantity: number;
    price: number; // Add price to the CartItem type
};

function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // Fetch cart data from localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    function removeItem(itemId: number) {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
    }

    function incrementQuantity(itemId: number) {
        const updatedCart = cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
    }

    function decrementQuantity(itemId: number) {
        const updatedCart = cartItems
            .map((item) =>
                item.id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0); // Remove items with quantity 0
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
    }

    // Calculate the total price of items in the cart
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <p>Add some dishes to your cart to see them here!</p>
            </div>
        );
    }

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <div className="cart-item-quantity">
                                <button onClick={() => decrementQuantity(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => incrementQuantity(item.id)}>+</button>
                            </div>
                        </div>
                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="cart-footer">
                <div className="cart-total">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                </div>
                <button className="checkout-btn">Checkout</button>
            </div>
        </div>
    );
}

export default CartPage;