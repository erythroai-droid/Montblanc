"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext/AuthContext.jsx";
import api from "../../../api/api.js";
import styles from "../admin.module.scss";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getOrders();
      if (Array.isArray(res)) {
        setOrders(res);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete order #${id}?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await api.admin.deleteOrder(id);
      setStatusMessage(`Order #${id} successfully deleted`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete order", err);
      alert("Error deleting order: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    return (
      order.id?.toString().includes(query) ||
      order.name?.toLowerCase().includes(query) ||
      order.email?.toLowerCase().includes(query) ||
      order.phone?.toLowerCase().includes(query) ||
      order.address?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {statusMessage && (
        <div style={{ background: "#dcfce7", color: "#16a34a", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: 600 }}>
          {statusMessage}
        </div>
      )}

      <div className={styles.adminCard}>
        <div className={styles.cardHeader}>
          <h3>{isAdmin ? "Orders" : "My Orders"} ({filteredOrders.length})</h3>
          <input
            type="text"
            placeholder="Search by ID, customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBar}
          />
        </div>

        <div className={styles.cardBody} style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>No orders found.</p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contacts</th>
                  <th>Delivery & Payment</th>
                  <th>Total</th>
                  <th>Items</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td><strong>#{order.id}</strong></td>
                        <td>
                          <div><strong>{order.name}</strong></div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{order.address}</div>
                          {order.comment && (
                            <div style={{ fontSize: "11px", color: "#9333ea", marginTop: "4px" }}>
                              <em>"{order.comment}"</em>
                            </div>
                          )}
                        </td>
                        <td>
                          <div>{order.email}</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{order.phone}</div>
                        </td>
                        <td>
                          <div style={{ marginBottom: "4px" }}>
                            <span className={`${styles.badgeTag} ${styles.category}`}>{order.delivery}</span>
                          </div>
                          <span className={`${styles.badgeTag} ${styles.discount}`}>{order.payment}</span>
                        </td>
                        <td>
                          <strong style={{ fontSize: "15px", color: "#16a34a" }}>{order.total} ₪</strong>
                        </td>
                        <td>
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            style={{
                              background: isExpanded ? "#e2e8f0" : "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {order.products?.length || 0} items {isExpanded ? "▲" : "▼"}
                          </button>
                        </td>
                        {isAdmin && (
                          <td>
                            <button
                              onClick={() => handleDelete(order.id)}
                              disabled={deletingId === order.id}
                              className={styles.btnDelete}
                            >
                              {deletingId === order.id ? "..." : "Delete"}
                            </button>
                          </td>
                        )}
                      </tr>

                      {isExpanded && order.products && order.products.length > 0 && (
                        <tr>
                          <td colSpan={isAdmin ? 7 : 6} style={{ background: "#f8fafc", padding: "16px 24px" }}>
                            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#334155" }}>
                              Order Items for #{order.id}:
                            </h4>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                              {order.products.map((item, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    background: "#fff",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                >
                                  {item.image && (
                                    <img
                                      src={item.image.startsWith("data:") ? item.image : `data:image/png;base64,${item.image}`}
                                      alt={item.name}
                                      style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
                                    />
                                  )}
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: "13px" }}>{item.name}</div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                                      {item.value} pcs × {item.price} ₪
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
