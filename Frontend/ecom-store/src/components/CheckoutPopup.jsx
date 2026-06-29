import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { productImageUrl } from "../axios";

const CheckoutPopup = ({
  show,
  handleClose,
  cartItems,
  totalPrice,
  onCheckoutComplete,
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const data = {
      customerName: name,
      email,
      items: orderItems,
    };

    try {
      await axios.post("http://localhost:8080/api/orders/place", data);
      await onCheckoutComplete();
      toast.success("Order placed successfully");
      handleClose();
      setName("");
      setEmail("");
      setValidated(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleConfirm}>
        <Modal.Body>
          {cartItems.map((item) => (
            <div key={item.id} className="d-flex mb-3 border-bottom pb-3">
              <img
                src={item.imageUrl || productImageUrl(item.id)}
                alt={item.name}
                className="me-3 rounded"
                style={{ width: "72px", height: "72px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <h6 className="mb-1">{item.name}</h6>
                <p className="mb-1 small">Quantity: {item.quantity}</p>
                <p className="mb-0 small">
                  Price: <i className="bi bi-currency-rupee"></i>
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div className="text-center my-3">
            <h5 className="fw-bold mb-0">
              Total: <i className="bi bi-currency-rupee"></i>
              {totalPrice.toFixed(2)}
            </h5>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Purchase"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckoutPopup;
