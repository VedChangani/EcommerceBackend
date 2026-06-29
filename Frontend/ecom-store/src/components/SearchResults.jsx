import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../Context/Context";
import { productImageUrl } from "../axios";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="page-shell d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2>Search Results</h2>
        <p>{searchData.length} product(s) found</p>
      </div>

      {searchData.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle-fill me-2"></i>
          No products found matching your search criteria.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          {searchData.map((product) => {
            const outOfStock =
              !product.productAvailable || product.stockQuantity <= 0;

            return (
              <div className="col" key={product.id}>
                <article
                  className={`product-card ${outOfStock ? "unavailable" : ""}`}
                >
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="product-card-image-wrap">
                      <img
                        src={productImageUrl(product.id)}
                        alt={product.name}
                        className="product-card-image"
                      />
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-card-title">{product.name}</h3>
                      <span className="product-card-brand">{product.brand}</span>
                      <span className="badge text-bg-secondary align-self-start">
                        {product.category}
                      </span>
                      <p className="small text-secondary mb-0">
                        {product.description?.length > 90
                          ? `${product.description.substring(0, 90)}...`
                          : product.description}
                      </p>
                      <div className="product-card-price">
                        <i className="bi bi-currency-rupee"></i>
                        {product.price}
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-3 d-flex gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-primary btn-sm flex-grow-1 rounded-pill"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={outOfStock}
                    >
                      {outOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
