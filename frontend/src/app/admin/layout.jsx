"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import api from "../../api/api.js";
import styles from "./admin.module.scss";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      if (authLoading) return;

      try {
        const res = await api.admin.getStats();
        if (!isMounted) return;

        if (res && res.authenticated && res.isAdmin) {
          setStats(res);
          setLoading(false);
          return;
        }

        // If not authenticated as admin
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        router.replace("/sign-in");
      } catch (err) {
        if (!isMounted) return;
        console.warn("Admin access check failed:", err);
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        router.replace("/sign-in");
      }
    }

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [authLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <p style={{ fontSize: "16px", color: "#64748b" }}>Loading admin panel...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Orders", href: "/admin/orders", icon: "📦" },
    { label: "Products", href: "/admin/products", icon: "🍕" },
    { label: "Categories", href: "/admin/categories", icon: "📁" },
  ];

  return (
    <div className={styles.adminLayout}>
      {sidebarOpen && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`${styles.adminSidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Mont Blanc</h2>
          <span className={styles.badge}>Admin</span>
          <button
            className={styles.btnCloseSidebar}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActive ? styles.active : ""}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>←</span> Back to Store
          </Link>
        </div>
      </aside>

      <div className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <div className={styles.headerTop}>
            <div className={styles.headerBrandMobile}>
              <button
                className={styles.btnMenuToggle}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle navigation menu"
              >
                ☰
              </button>
              <span className={styles.mobileTitle}>Mont Blanc</span>
            </div>

            <div className={styles.headerUser}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{stats?.userName || "Administrator"}</div>
                <div className={styles.userRole}>{stats?.isAdmin ? "Super Admin" : "User"}</div>
              </div>
              <button onClick={handleLogout} className={styles.btnLogout}>
                Logout
              </button>
            </div>
          </div>

          <h1 className={styles.headerTitle}>
            {pathname === "/admin" && "Dashboard"}
            {pathname === "/admin/orders" && "Orders Management"}
            {pathname.startsWith("/admin/products") && "Products Management"}
            {pathname === "/admin/categories" && "Categories Management"}
          </h1>
        </header>

        <main className={styles.adminContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
