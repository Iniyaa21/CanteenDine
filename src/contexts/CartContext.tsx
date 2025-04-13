import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext<any>(null);

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any>([]);

    useEffect(() => {
        const storedDishes = localStorage.getItem("cart");
        if (storedDishes) {
            setCart(JSON.parse(storedDishes));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (dish: any) => {
        const existingDish = cart.find((item: any) => item.id === dish.id);
        if (existingDish) {
            setCart((prevCart: any) =>
                prevCart.map((item: any) =>
                    item.id === dish.id
                        ? { ...item, quantity: dish.quantity }
                        : item
                )
            );
        } else {
            setCart((prevCart: any) => [...prevCart, dish]);
        }
    };

    const removeFromCart = (dishId: number) => {
        setCart((prev: any) => prev.filter((dish: any) => dish.id !== dishId));
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