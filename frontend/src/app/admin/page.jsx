"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../api/api.js";
import styles from "./admin.module.scss";

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
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>📦</div>
          <div className={styles.statInfo}>
            <h3>{stats.orderCount || 0}</h3>
            <p>{stats.isAdmin ? "Total Orders" : "My Orders"}</p>
          </div>
        </div>

        {stats.isAdmin && (
          <>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.blue}`}>🍕</div>
              <div className={styles.statInfo}>
                <h3>{stats.productCount || 0}</h3>
                <p>Active Products</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.purple}`}>📁</div>
              <div className={styles.statInfo}>
                <h3>{stats.categoryCount || 0}</h3>
                <p>Categories</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.adminCard}>
        <div className={styles.cardHeader}>
          <h3>{stats.isAdmin ? "Quick Actions" : "Customer Actions"}</h3>
        </div>
        <div className={styles.cardBody} style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {stats.isAdmin ? (
            <>
              <Link href="/admin/products/new" className={styles.btnPrimary}>
                <span>+</span> Add New Product
              </Link>
              <Link href="/admin/orders" className={styles.btnPrimary} style={{ backgroundColor: "#2563eb" }}>
                <span>📋</span> View All Orders
              </Link>
              <Link href="/admin/categories" className={styles.btnPrimary} style={{ backgroundColor: "#9333ea" }}>
                <span>📁</span> Manage Categories
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={styles.btnPrimary}>
                <span>🛒</span> Go to Store
              </Link>
              <Link href="/admin/orders" className={styles.btnPrimary} style={{ backgroundColor: "#2563eb" }}>
                <span>📋</span> My Orders History
              </Link>
            </>
          )}
        </div>
      </div>

      <div className={styles.adminCard}>
        <div className={styles.cardHeader}>
          <h3>{stats.isAdmin ? "Recent Orders" : "My Recent Orders"}</h3>
          {stats.isAdmin && (
            <Link href="/admin/orders" style={{ fontSize: "13px", color: "#46bb22", textDecoration: "none", fontWeight: 600 }}>
              View All ({stats.orderCount || 0}) →
            </Link>
          )}
        </div>
        <div className={styles.cardBody} style={{ padding: 0 }}>
          {recentOrders.length === 0 ? (
            <p style={{ padding: "24px", color: "#64748b", margin: 0 }}>No orders yet.</p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.adminTable}>
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
                        <span className={`${styles.badgeTag} ${styles.category}`}>{order.delivery}</span>
                      </td>
                      <td>
                        <strong>{order.total} ₪</strong>
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
  );
}
