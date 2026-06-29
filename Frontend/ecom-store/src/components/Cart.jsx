import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import AppContext from "../Context/Context";
import API, { productImageUrl } from "../axios";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, removeFromCart, clearCart, refreshData, updateCartItem } =
    useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncCart = async () => {
      if (!cart.length) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/products");
        const backendIds = response.data.map((product) => product.id);
        const validItems = cart.filter((item) => backendIds.includes(item.id));

        const itemsWithImages = await Promise.all(
          validItems.map(async (item) => {
            try {
              const imageResponse = await axios.get(productImageUrl(item.id), {
                responseType: "blob",
              });
              return {
                ...item,
                imageUrl: URL.createObjectURL(imageResponse.data),
              };
            } catch {
              return { ...item, imageUrl: productImageUrl(item.id) };
            }
          })
        );

        setCartItems(itemsWithImages);
      } catch (error) {
        console.error("Error syncing cart:", error);
        setCartItems(cart);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find((entry) => entry.id === itemId);
    if (item && item.quantity >= item.stockQuantity) {
      toast.info("Cannot add more than available stock");
      return;
    }
    updateCartItem(itemId, { quantity: item.quantity + 1 });
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find((entry) => entry.id === itemId);
    if (!item) return;
    updateCartItem(itemId, { quantity: Math.max(item.quantity - 1, 1) });
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } =
          item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = {
          ...rest,
          stockQuantity: updatedStockQuantity,
        };

        const formData = new FormData();
        formData.append("imageFile", new Blob([]));
        formData.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          })
        );

        await axios.put(`http://localhost:8080/api/product/${item.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
      refreshData();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    }
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
        <h2>Shopping Cart</h2>
        <p>Review your items and proceed to checkout.</p>
      </div>

      <div className="surface-card">
        {cartItems.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-cart-x d-block"></i>
            <h4>Your cart is empty</h4>
            <a href="/" className="btn btn-primary rounded-pill mt-2">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="rounded"
                            width="72"
                            height="72"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <div className="fw-semibold">{item.name}</div>
                            <small className="text-secondary">{item.brand}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-currency-rupee"></i>
                        {item.price}
                      </td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: "130px" }}>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleDecreaseQuantity(item.id)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleIncreaseQuantity(item.id)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">
                        <i className="bi bi-currency-rupee"></i>
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
              <span className="h5 mb-0">Grand Total</span>
              <span className="h5 mb-0 text-primary">
                <i className="bi bi-currency-rupee"></i>
                {totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="d-grid mt-4">
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill"
                onClick={() => setShowModal(true)}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        onCheckoutComplete={handleCheckout}
      />
    </div>
  );
};

export default Cart;
