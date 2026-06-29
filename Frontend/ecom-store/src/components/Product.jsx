import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppContext from "../Context/Context";
import API, { productImageUrl } from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
    setImageUrl(productImageUrl(id));
  }, [id]);

  const deleteProduct = async () => {
    try {
      await API.delete(`/product/${id}`);
      removeFromCart(Number(id));
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  if (!product) {
    return (
      <div className="page-shell d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const outOfStock = !product.productAvailable || product.stockQuantity === 0;

  return (
    <div className="page-shell">
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <div className="product-detail-image">
            <img src={imageUrl} alt={product.name} />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="surface-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge text-bg-primary">{product.category}</span>
              <small className="text-secondary">
                Listed: {new Date(product.releaseDate).toLocaleDateString()}
              </small>
            </div>

            <h1 className="h2 text-capitalize mb-1">{product.name}</h1>
            <p className="text-secondary fst-italic mb-4">~ {product.brand}</p>

            <h3 className="text-primary fw-bold mb-4">
              <i className="bi bi-currency-rupee"></i>
              {product.price}
            </h3>

            <div className="mb-4">
              <h6 className="text-uppercase text-secondary">Description</h6>
              <p className="mb-0">{product.description}</p>
            </div>

            <p className="mb-4">
              Stock available:{" "}
              <span className="fw-bold text-success">{product.stockQuantity}</span>
            </p>

            <div className="d-grid gap-2 mb-4">
              <button
                className="btn btn-primary btn-lg rounded-pill"
                onClick={handleAddToCart}
                disabled={outOfStock}
              >
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-outline-primary rounded-pill"
                onClick={() => navigate(`/product/update/${id}`)}
              >
                <i className="bi bi-pencil me-1"></i>
                Update
              </button>
              <button
                className="btn btn-outline-danger rounded-pill"
                onClick={deleteProduct}
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
