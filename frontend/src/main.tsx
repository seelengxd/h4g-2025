import "@/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { StoreProvider } from "@/store/store-provider.tsx";
import Login from "./pages/auth/login";
import Layout from "./components/layout/layout";
import Products from "./pages/products/products";
import Product from "./pages/products/product";
import Cart from "./pages/orders/cart";
import Home from "./pages/home/home";
import Order from "./pages/orders/order";
import Auctions from "./pages/auctions/auctions";
import Auction from "./pages/auctions/auction";
import AuthenticatedPage from "./components/layout/authenticated-page";
import Vouchers from "./pages/vouchers/vouchers";
import User from "./pages/users/user";
import Users from "./pages/users/users";
import Voucher from "./pages/vouchers/voucher";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="" element={<AuthenticatedPage />}>
              <Route index element={<Home />} />
              <Route path="users">
                <Route index element={<Users />} />
                <Route path=":id" element={<User />} />
              </Route>
              <Route path="products">
                <Route index element={<Products />} />
                <Route path=":id" element={<Product />} />
              </Route>
              <Route path="vouchers">
                <Route index element={<Vouchers />} />
                <Route path=":id" element={<Voucher />} />
              </Route>
              <Route path="cart" element={<Cart />} />
              <Route path="orders">
                <Route path=":id" element={<Order />} />
              </Route>
              <Route path="auctions">
                <Route index element={<Auctions />} />
                <Route path=":id" element={<Auction />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
);
