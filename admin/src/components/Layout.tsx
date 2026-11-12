import { NavLink, Outlet } from "react-router-dom";
import { setToken } from "../api";

const sections = [
  { to: "/", label: "Tableau de bord", end: true },
  { to: "/commandes", label: "Commandes" },
  { to: "/messages", label: "Messages" },
  { to: "/images", label: "Images" },
  { to: "/produits", label: "Produits" },
  { to: "/journal", label: "Journal" },
  { to: "/abonnes", label: "Abonnés" },
];

export function Layout({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      <nav className="nav">
        <div className="container">
          <span className="brand">Flora · Admin</span>
          {sections.map((section) => (
            <NavLink key={section.to} to={section.to} end={section.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {section.label}
            </NavLink>
          ))}
          <button
            className="spacer"
            onClick={() => {
              setToken("");
              onLogout();
            }}
          >
            Se déconnecter
          </button>
        </div>
      </nav>
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}
