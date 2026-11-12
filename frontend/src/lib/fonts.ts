import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";

/** Titres : Bodoni Moda (didone élégante, avec italiques). Classe Tailwind : font-display */
export const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

/** Texte courant : Hanken Grotesk. Classe Tailwind : font-sans */
export const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});
