import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../Context/Context";
import axios from "axios";
import { productImageUrl } from "../axios";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, [refreshData]);

  useEffect(() => {
    if (!data?.length) {
      setProducts([]);
      return;
    }

    const loadImages = async () => {
      const enriched = await Promise.all(
        data.map(async (product) => {
          try {
            const response = await axios.get(productImageUrl(product.id), {
              responseType: "blob",
            });
            return {
              ...product,
              imageUrl: URL.createObjectURL(response.data),
            };
          } catch {
            return { ...product, imageUrl: productImageUrl(product.id) };
          }
        })
      );
      setProducts(enriched);
    };

    loadImages();
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
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

  if (isError) {
    return (
      <div className="page-shell">
        <div className="empty-state surface-card">
          <i className="bi bi-wifi-off d-block"></i>
          <h4>Unable to load products</h4>
          <p>Please make sure the backend is running on port 8080.</p>
          <button className="btn btn-primary" onClick={refreshData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="hero-banner">
        <h1>Discover your next favorite product</h1>
        <p>
          Browse curated categories, search instantly, and checkout in seconds.
        </p>
      </section>

      {selectedCategory && (
        <div className="category-pills">
          <span className="category-pill active">
            {selectedCategory}
            <i className="bi bi-funnel ms-2"></i>
          </span>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="empty-state surface-card">
          <i className="bi bi-box-seam d-block"></i>
          <h4>No products available</h4>
          <p>Try another category or add a new product.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
          {filteredProducts.map((product) => {
            const outOfStock =
              !product.productAvailable || product.stockQuantity === 0;

            return (
              <div className="col" key={product.id}>
                <article
                  className={`product-card ${outOfStock ? "unavailable" : ""}`}
                >
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="product-card-image-wrap">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-card-image"
                      />
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-card-title">
                        {product.name.toUpperCase()}
                      </h3>
                      <span className="product-card-brand">~ {product.brand}</span>
                      <div className="product-card-price">
                        <i className="bi bi-currency-rupee"></i>
                        {product.price}
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-3">
                    <button
                      className="btn btn-primary w-100 btn-add"
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

export default Home;
