"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../api/api.js";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getProducts();
      if (Array.isArray(res)) {
        setProducts(res);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}" (ID: ${id})?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await api.admin.deleteProduct(id);
      setStatusMessage(`Product "${name}" successfully removed`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Error deleting product: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.categoryName?.toLowerCase().includes(query) ||
      product.id?.toString().includes(query)
    );
  });

  return (
    <div>
      {statusMessage && (
        <div style={{ background: "#dcfce7", color: "#16a34a", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: 600 }}>
          {statusMessage}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Products Catalog ({filteredProducts.length})</h3>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                width: "280px",
                fontSize: "13px",
              }}
            />
            <Link href="/admin/products/new" className="btn-primary">
              <span>+</span> Add Product
            </Link>
          </div>
        </div>

        <div className="admin-card__body" style={{ padding: 0 }}>
          {loading ? (
            <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>No products found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Special</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image ? (
                        <img
                          src={product.image.startsWith("data:") ? product.image : `data:image/png;base64,${product.image}`}
                          alt={product.name}
                          className="thumbnail"
                        />
                      ) : (
                        <div className="thumbnail" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>📷</div>
                      )}
                    </td>
                    <td><strong>#{product.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      {product.description && (
                        <div style={{ fontSize: "12px", color: "#64748b", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge-tag category">{product.categoryName || "Uncategorized"}</span>
                    </td>
                    <td>
                      <strong>{parseFloat(product.price).toFixed(2)} ₪</strong>
                    </td>
                    <td>
                      {product.discount > 0 ? (
                        <span className="badge-tag discount">-{product.discount}%</span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td>
                      {product.specialOffers ? (
                        <span className="badge-tag special">Special</span>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="btn-delete"
                      >
                        {deletingId === product.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
