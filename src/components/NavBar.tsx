// NavBar.tsx
import { Link, useLocation } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import "../css/NavBar.css";

function NavBar() {
  const location = useLocation();
  const { cart } = useCartContext(); // Access the cart from the context

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo-text">Canténe</Link>
      </div>
      <div className="navbar-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home  
        </Link>
        <Link 
          to="/cart" 
          className={`nav-link ${location.pathname === "/cart" ? "active" : ""}`}
        >
          <span className="cart-icon">
            <span className="cart-text">My Cart</span>
            <span className="cart-counter">{cart.length}</span> {/* Use cart length */}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;