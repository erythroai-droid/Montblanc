"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../api/api.js";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    orderCount: 0,
    productCount: 0,
    categoryCount: 0,
    isAdmin: false,
    userName: "",
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await api.admin.getStats();
        if (statsRes) setStats(statsRes);

        const ordersRes = await api.admin.getOrders();
        if (Array.isArray(ordersRes)) {
          setRecentOrders(ordersRes.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon green">📦</div>
          <div className="stat-card__info">
            <h3>{stats.orderCount || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon blue">🍕</div>
          <div className="stat-card__info">
            <h3>{stats.productCount || 0}</h3>
            <p>Active Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon purple">📁</div>
          <div className="stat-card__info">
            <h3>{stats.categoryCount || 0}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quick Actions</h3>
        </div>
        <div className="admin-card__body" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/admin/products/new" className="btn-primary">
            <span>+</span> Add New Product
          </Link>
          <Link href="/admin/orders" className="btn-primary" style={{ backgroundColor: "#2563eb" }}>
            <span>📋</span> View All Orders
          </Link>
          <Link href="/admin/categories" className="btn-primary" style={{ backgroundColor: "#9333ea" }}>
            <span>📁</span> Manage Categories
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Recent Orders</h3>
          <Link href="/admin/orders" style={{ fontSize: "13px", color: "#46bb22", textDecoration: "none", fontWeight: 600 }}>
            View All ({stats.orderCount || 0}) →
          </Link>
        </div>
        <div className="admin-card__body" style={{ padding: 0 }}>
          {recentOrders.length === 0 ? (
            <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>No orders yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Delivery</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>
                      <div><strong>{order.name}</strong></div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{order.address}</div>
                    </td>
                    <td>
                      <div>{order.email}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{order.phone}</div>
                    </td>
                    <td>
                      <span className="badge-tag category">{order.delivery}</span>
                    </td>
                    <td>
                      <strong>{order.total} ₪</strong>
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
