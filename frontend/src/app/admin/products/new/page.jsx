"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../api/api.js";
import styles from "../../admin.module.scss";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    special: false,
    discount: "0",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.admin.getCategories();
        if (Array.isArray(res) && res.length > 0) {
          setCategories(res);
          setFormData((prev) => ({ ...prev, categoryId: res[0].id.toString() }));
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please provide a valid price");
      return;
    }
    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }
    if (!selectedFile) {
      setError("Please select a product image");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("price", formData.price.trim());
      data.append("categoryId", formData.categoryId);
      data.append("special", formData.special.toString());
      data.append("discount", formData.discount || "0");
      data.append("description", formData.description.trim());
      data.append("image", selectedFile);

      await api.admin.createProduct(data);
      router.push("/admin/products");
    } catch (err) {
      console.error("Error creating product", err);
      setError(err.response?.data?.message || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.adminCard}>
        <div className={styles.cardHeader}>
          <h3>Add New Product</h3>
          <Link href="/admin/products" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none" }}>
            ← Back to Products
          </Link>
        </div>

        <div className={styles.cardBody}>
          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.adminForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                required
                placeholder="e.g. Gorgonzola Dolce DOP"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price (₪) *</label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  required
                  placeholder="e.g. 45.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="categoryId">Category *</label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.name_ru ? `(${c.name_ru})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="discount">Discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>

              <div className={styles.formGroup} style={{ justifyContent: "center" }}>
                <label className={styles.checkboxGroup} style={{ marginTop: "24px" }}>
                  <input
                    type="checkbox"
                    checked={formData.special}
                    onChange={(e) => setFormData({ ...formData, special: e.target.checked })}
                  />
                  <span>Mark as Special Offer</span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                placeholder="Detailed description of taste, origin, and characteristics..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image">Product Image *</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                required
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div className={styles.imagePreview}>
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? "Saving Product..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
