import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors({ ...errors, image: "Please select a JPEG or PNG image" });
    } else if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size should be less than 5MB" });
    } else {
      setErrors({ ...errors, image: null });
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!product.name.trim()) nextErrors.name = "Product name is required";
    if (!product.brand.trim()) nextErrors.brand = "Brand is required";
    if (!product.description.trim()) {
      nextErrors.description = "Description is required";
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      nextErrors.price = "Price must be greater than zero";
    }
    if (!product.category) nextErrors.category = "Please select a category";
    if (!product.stockQuantity || parseInt(product.stockQuantity, 10) < 0) {
      nextErrors.stockQuantity = "Stock quantity cannot be negative";
    }
    if (!product.releaseDate) nextErrors.releaseDate = "Release date is required";
    if (!image) nextErrors.image = "Product image is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      await API.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error adding product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell form-shell">
      <div className="page-header text-center">
        <h2>Add Product</h2>
        <p>Create a new listing for your store catalog.</p>
      </div>

      <div className="surface-card p-4">
        <form onSubmit={submitHandler} className="row g-4">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={product.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={product.brand}
              onChange={handleInputChange}
            />
            {errors.brand && <div className="text-danger small">{errors.brand}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={product.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <div className="text-danger small">{errors.description}</div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={product.price}
              onChange={handleInputChange}
            />
            {errors.price && <div className="text-danger small">{errors.price}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="text-danger small">{errors.category}</div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              className="form-control"
              value={product.stockQuantity}
              onChange={handleInputChange}
            />
            {errors.stockQuantity && (
              <div className="text-danger small">{errors.stockQuantity}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              className="form-control"
              value={product.releaseDate}
              onChange={handleInputChange}
            />
            {errors.releaseDate && (
              <div className="text-danger small">{errors.releaseDate}</div>
            )}
          </div>

          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                checked={product.productAvailable}
                onChange={handleInputChange}
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
            />
            {errors.image && <div className="text-danger small">{errors.image}</div>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 rounded"
                style={{ maxWidth: "180px" }}
              />
            )}
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
