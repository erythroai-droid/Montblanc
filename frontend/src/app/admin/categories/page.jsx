"use client";

import React, { useEffect, useState } from "react";
import api from "../../../api/api.js";
import styles from "../admin.module.scss";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    name_ru: "",
    name_he: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getCategories();
      if (Array.isArray(res)) {
        setCategories(res);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name (English) is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.admin.createCategory({
        name: formData.name.trim(),
        name_ru: formData.name_ru.trim(),
        name_he: formData.name_he.trim(),
      });

      setStatusMessage(`Category "${formData.name}" added successfully`);
      setFormData({ name: "", name_ru: "", name_he: "" });
      loadCategories();
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Failed to create category", err);
      setError(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await api.admin.deleteCategory(id);
      setStatusMessage(`Category "${name}" deleted`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Error deleting category: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {statusMessage && (
        <div style={{ background: "#dcfce7", color: "#16a34a", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontWeight: 600 }}>
          {statusMessage}
        </div>
      )}

      <div className={styles.categoriesGrid}>
        <div className={styles.adminCard}>
          <div className={styles.cardHeader}>
            <h3>Add New Category</h3>
          </div>
          <div className={styles.cardBody}>
            {error && (
              <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAddCategory} className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label htmlFor="cat_name">Category Name (English / Slug basis) *</label>
                <input
                  type="text"
                  id="cat_name"
                  required
                  placeholder="e.g. Farm Cheeses"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cat_ru">Name (Russian)</label>
                <input
                  type="text"
                  id="cat_ru"
                  placeholder="например: Фермерские сыры"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cat_he">Name (Hebrew)</label>
                <input
                  type="text"
                  id="cat_he"
                  placeholder="למשל: גבינות משק"
                  value={formData.name_he}
                  onChange={(e) => setFormData({ ...formData, name_he: e.target.value })}
                />
              </div>

              <button type="submit" disabled={submitting} className={styles.btnSubmit}>
                {submitting ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.adminCard}>
          <div className={styles.cardHeader}>
            <h3>Existing Categories ({categories.length})</h3>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            {loading ? (
              <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>Loading categories...</p>
            ) : categories.length === 0 ? (
              <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>No categories created yet.</p>
            ) : (
              <div className={styles.tableResponsive}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>English</th>
                      <th>Russian</th>
                      <th>Hebrew</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td><strong>#{cat.id}</strong></td>
                        <td><strong>{cat.name}</strong></td>
                        <td>{cat.name_ru || "—"}</td>
                        <td>{cat.name_he || "—"}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={deletingId === cat.id}
                            className={styles.btnDelete}
                          >
                            {deletingId === cat.id ? "..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
