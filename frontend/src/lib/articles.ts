import { apiGet } from "./backend";
import { seedArticles, type Article } from "./journal";

/**
 * Articles publiés, du plus récent au plus ancien, depuis l'API.
 * Si l'API est injoignable : les articles de secours de lib/journal.ts.
 */
export async function getArticles(): Promise<Article[]> {
  const fallback = [...seedArticles].sort((a, b) => b.date.localeCompare(a.date));
  return (await apiGet<Article[]>("/api/articles")) ?? fallback;
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((article) => article.slug === slug);
}
