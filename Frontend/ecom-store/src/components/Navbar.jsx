import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import API, { productImageUrl } from "../axios";
import API, { productImageUrl } from "../axios";

const CATEGORIES = [
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light-theme"
  );
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const handleCategorySelect = (category) => {
    const next = activeCategory === category ? "" : category;
    setActiveCategory(next);
    onSelectCategory(next);
    setIsNavCollapsed(true);
  };

  const handleInputChange = async (value) => {
    setInput(value);

    if (value.trim().length < 1) {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setShowSearchResults(true);
    try {
      const response = await API.get(`/products/search?keyword=${value}`);
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error("Error searching:", error);
      setNoResults(true);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setIsNavCollapsed(true);
    setShowSearchResults(false);

    try {
      const response = await API.get(`/products/search?keyword=${input}`);
      if (response.data.length === 0) {
        setNoResults(true);
        setShowSearchResults(true);
      } else {
        navigate("/search-results", { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass-navbar">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand" to="/" onClick={() => setIsNavCollapsed(true)}>
          Telusko Store
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/" onClick={() => setIsNavCollapsed(true)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add_product" onClick={() => setIsNavCollapsed(true)}>
                Add Product
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders" onClick={() => setIsNavCollapsed(true)}>
                Orders
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </button>
              <ul className="dropdown-menu">
                {CATEGORIES.map((category) => (
                  <li key={category}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                      {activeCategory === category && (
                        <i className="bi bi-check2 ms-2"></i>
                      )}
                    </button>
                  </li>
                ))}
                {activeCategory && (
                  <li>
                    <hr className="dropdown-divider" />
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => handleCategorySelect("")}
                    >
                      Clear filter
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end w-100 w-lg-auto">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark-theme" ? (
                <i className="bi bi-sun-fill"></i>
              ) : (
                <i className="bi bi-moon-stars-fill"></i>
              )}
            </button>

            <Link
              to="/cart"
              className="cart-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <i className="bi bi-cart3 fs-5"></i>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <div className="search-wrap" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <div className="position-relative flex-grow-1">
                  <i className="bi bi-search search-icon"></i>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search products..."
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => input.trim() && setShowSearchResults(true)}
                  />
                </div>
                <button
                  className="btn btn-primary rounded-pill px-3"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    "Search"
                  )}
                </button>
              </form>

              {showSearchResults && (
                <div className="search-dropdown">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={`/product/${result.id}`}
                        className="search-dropdown-item"
                        onClick={() => {
                          setShowSearchResults(false);
                          setIsNavCollapsed(true);
                        }}
                      >
                        <img src={productImageUrl(result.id)} alt={result.name} />
                        <div>
                          <div className="fw-semibold">{result.name}</div>
                          <small className="text-secondary">{result.brand}</small>
                        </div>
                      </Link>
                    ))
                  ) : (
                    noResults && (
                      <div className="p-3 text-center text-secondary">
                        No products found
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
