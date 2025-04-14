import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext<any>(null);

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCartState] = useState<any>([]);

    // Helper function to update cart state and sync with local storage
    const updateCart = (newCart: any) => {
        setCartState(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    useEffect(() => {
        const storedDishes = localStorage.getItem("cart");
        if (storedDishes) {
            setCartState(JSON.parse(storedDishes));
        }
    }, []);

    const addToCart = (dish: any) => {
        const existingDish = cart.find((item: any) => item.id === dish.id);
        if (existingDish) {
            updateCart(
                cart.map((item: any) =>
                    item.id === dish.id
                        ? { ...item, quantity: dish.quantity }
                        : item
                )
            );
        } else {
            updateCart([...cart, dish]);
        }
    };

    const removeFromCart = (dishId: number) => {
        updateCart(cart.filter((dish: any) => dish.id !== dishId));
    };

    const isInCart = (dishId: number) => {
        return cart.some((dish: any) => dish.id === dishId);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        isInCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};