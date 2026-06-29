import React, { useEffect, useState } from "react";
import API from "../axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-info";
      case "SHIPPED":
        return "bg-primary";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const calculateOrderTotal = (items) =>
    items.reduce((total, item) => total + item.totalPrice, 0);

  if (loading) {
    return (
      <div className="page-shell d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2>Order Management</h2>
        <p>Track all customer orders and their current status.</p>
      </div>

      <div className="surface-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Orders ({orders.length})</h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.orderId}>
                    <tr>
                      <td className="fw-semibold">{order.orderId}</td>
                      <td>
                        <div>{order.customerName}</div>
                        <small className="text-secondary">{order.email}</small>
                      </td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.items.length}</td>
                      <td className="fw-bold">
                        {formatCurrency(calculateOrderTotal(order.items))}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.orderId
                                ? null
                                : order.orderId
                            )
                          }
                        >
                          {expandedOrder === order.orderId
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.orderId && (
                      <tr>
                        <td colSpan="7" className="p-0">
                          <div className="bg-light p-3">
                            <h6 className="mb-3">Order Items</h6>
                            <table className="table table-sm table-bordered mb-0">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">
                                      {formatCurrency(item.totalPrice)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="table-info">
                                  <td colSpan="2" className="text-end fw-bold">
                                    Total
                                  </td>
                                  <td className="text-end fw-bold">
                                    {formatCurrency(
                                      calculateOrderTotal(order.items)
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;
