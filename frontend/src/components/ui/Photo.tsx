import Image from "next/image";

/**
 * Image optimisée (next/image) dans un conteneur à taille libre.
 * - `className` : taille, forme et bordure du conteneur (ex. "aspect-4/5 rounded-3xl")
 * - `imgClassName` : effets sur l’image (ex. zoom au survol)
 * - `sizes` : largeur affichée selon l’écran, pour charger la bonne taille d’image
 * - `eager` : à utiliser pour l’image principale visible dès l’arrivée sur la page
 */
export function Photo({
  src,
  alt,
  sizes,
  position,
  eager = false,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  position?: string;
  eager?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        // Photos envoyées depuis l'admin (/api/images/…) : servies telles quelles par l'API
        unoptimized={src.startsWith("/api/")}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        style={position ? { objectPosition: position } : undefined}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
