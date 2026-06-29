import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "./Context/Context";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import Order from "./components/Order";
import SearchResults from "./components/SearchResults";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          theme="colored"
        />
        <Navbar onSelectCategory={setSelectedCategory} />
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<Home selectedCategory={selectedCategory} />}
            />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/update/:id" element={<UpdateProduct />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/search-results" element={<SearchResults />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
