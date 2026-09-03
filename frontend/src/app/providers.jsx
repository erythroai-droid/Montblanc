"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store.js";
import { LanguageProvider } from "../context/LanguageContext/LanguageContext.jsx";
import CartProvider from "../context/CartContext/CartContext.jsx";
import { AuthProvider } from "../context/AuthContext/AuthContext.jsx";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <CartProvider>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </CartProvider>
    </Provider>
  );
}
