import type { NextConfig } from "next";

// Adresse de l'API (dossier backend/). Réglage dans .env.local : API_URL.
const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Les formulaires du site (commande, contact, newsletter) et les photos envoyées depuis l'admin
  // passent par l'adresse du site (/api/…) : le site les transmet à l'API. Pas de réglage CORS à faire.
  async rewrites() {
    return [
      { source: "/api/:path(orders|contact|newsletter)", destination: `${API_URL}/api/:path` },
      { source: "/api/images/:id", destination: `${API_URL}/api/images/:id` },
    ];
  },
};

export default nextConfig;
