export const occasions = [
  {
    slug: "anniversaire",
    title: "Un anniversaire à célébrer",
    text: "Des couleurs franches et généreuses pour marquer un nouvel âge.",
  },
  {
    slug: "merci",
    title: "Un merci qui vient du cœur",
    text: "Des teintes douces et un petit format, pour dire merci sans en faire trop.",
  },
  {
    slug: "amour",
    title: "Un peu, beaucoup, passionnément",
    text: "Des compositions chaudes et romantiques, pour les grandes déclarations.",
  },
  {
    slug: "juste-comme-ca",
    title: "Juste comme ça",
    text: "Parce qu’il n’y a pas besoin de raison pour faire plaisir.",
  },
] as const;

export type OccasionSlug = (typeof occasions)[number]["slug"];

export function isOccasionSlug(value: string | undefined): value is OccasionSlug {
  return occasions.some((occasion) => occasion.slug === value);
}
