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
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}