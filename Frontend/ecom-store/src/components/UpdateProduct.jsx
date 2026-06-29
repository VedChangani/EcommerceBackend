import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../axios";

const CATEGORIES = [
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        setProduct(response.data);
        setUpdateProduct(response.data);

        const imageResponse = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = new File(
          [imageResponse.data],
          response.data.imageName,
          { type: imageResponse.data.type }
        );
        setImage(imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setImageChanged(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (imageChanged && image) {
      formData.append("imageFile", image);
    } else {
      formData.append("imageFile", null);
    }
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await API.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="page-shell form-shell">
      <div className="page-header text-center">
        <h2>Update Product</h2>
        <p>Edit product details and inventory information.</p>
      </div>

      <div className="surface-card p-4">
        <form className="row g-4" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              value={updateProduct.stockQuantity}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Release Date</label>
            <input
              type="date"
              className="form-control"
              name="releaseDate"
              value={
                updateProduct.releaseDate
                  ? updateProduct.releaseDate.slice(0, 10)
                  : ""
              }
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Image</label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt={product.name}
                className="d-block mb-2 rounded"
                style={{ height: "150px", objectFit: "contain" }}
              />
            )}
            <input
              className="form-control"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
            />
            <div className="form-text">Leave empty to keep current image</div>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({
                    ...updateProduct,
                    productAvailable: e.target.checked,
                  })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary rounded-pill"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
