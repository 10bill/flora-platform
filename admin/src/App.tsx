import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./api";
import { Layout } from "./components/Layout";
import { ArticleForm } from "./pages/ArticleForm";
import { Dashboard } from "./pages/Dashboard";
import { Images } from "./pages/Images";
import { Journal } from "./pages/Journal";
import { Login } from "./pages/Login";
import { Messages } from "./pages/Messages";
import { Orders } from "./pages/Orders";
import { ProductForm } from "./pages/ProductForm";
import { Products } from "./pages/Products";
import { Subscribers } from "./pages/Subscribers";

export function App() {
  const [loggedIn, setLoggedIn] = useState(() => getToken() !== "");

  // Quand l'API répond « connexion requise » (session expirée), on revient à la page de connexion
  useEffect(() => {
    const onUnauthorized = () => setLoggedIn(false);
    window.addEventListener("flora:unauthorized", onUnauthorized);
    return () => window.removeEventListener("flora:unauthorized", onUnauthorized);
  }, []);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <Routes>
      <Route element={<Layout onLogout={() => setLoggedIn(false)} />}>
        <Route index element={<Dashboard />} />
        <Route path="commandes" element={<Orders />} />
        <Route path="messages" element={<Messages />} />
        <Route path="images" element={<Images />} />
        <Route path="produits" element={<Products />} />
        <Route path="produits/nouveau" element={<ProductForm />} />
        <Route path="produits/:slug" element={<ProductForm />} />
        <Route path="journal" element={<Journal />} />
        <Route path="journal/nouveau" element={<ArticleForm />} />
        <Route path="journal/:slug" element={<ArticleForm />} />
        <Route path="abonnes" element={<Subscribers />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
