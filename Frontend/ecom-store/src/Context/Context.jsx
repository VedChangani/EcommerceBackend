import { useState, useEffect, createContext } from "react";
import API from "../axios";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  refreshData: () => {},
  clearCart: () => {},
  updateCartItem: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let updatedCart;

    if (existingIndex !== -1) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const { imageData, ...productWithoutImage } = product;
      updatedCart = [...cart, { ...productWithoutImage, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const updateCartItem = (productId, updates) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, ...updates } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const refreshData = async () => {
    try {
      const response = await API.get("/products");
      setData(response.data);
      setIsError("");
    } catch (error) {
      setIsError(error.message);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
        updateCartItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
