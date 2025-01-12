import "@/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { StoreProvider } from "@/store/store-provider.tsx";
import Login from "./pages/auth/login";
import Layout from "./components/layout/layout";
import Users from "./pages/users/users";
import User from "./pages/users/user";
import Products from "./pages/products/products";
import Product from "./pages/products/product";
import Cart from "./pages/orders/cart";
import Home from "./pages/home/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<Users />} />
              <Route path=":id" element={<User />} />
            </Route>
            <Route path="products">
              <Route index element={<Products />} />
              <Route path=":id" element={<Product />} />
            </Route>
            <Route path="cart" element={<Cart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
);
