import "@/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { StoreProvider } from "@/store/store-provider.tsx";
import Login from "./pages/Login";
import Layout from "./components/layout/layout";
import Users from "./pages/users/Users";
import User from "./pages/users/User";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<Users />} />
              <Route path=":id" element={<User />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
);
