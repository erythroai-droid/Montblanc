"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import styles from "./admin.module.scss";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.admin.getStats();
        if (!res || !res.authenticated) {
          router.push("/sign-in");
          return;
        }
        setStats(res);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

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
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Mont Blanc</h2>
          <span className={styles.badge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={isActive ? styles.active : ""}>
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
          <h1 className={styles.headerTitle}>
            {pathname === "/admin" && "Dashboard"}
            {pathname === "/admin/orders" && "Orders Management"}
            {pathname.startsWith("/admin/products") && "Products Management"}
            {pathname === "/admin/categories" && "Categories Management"}
          </h1>

          <div className={styles.headerUser}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{stats?.userName || "Administrator"}</div>
              <div className={styles.userRole}>{stats?.isAdmin ? "Super Admin" : "User"}</div>
            </div>
            <button onClick={handleLogout} className={styles.btnLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className={styles.adminContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
