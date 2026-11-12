import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { textLink } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/Em";
import { PageHeader } from "@/components/ui/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { formatDate } from "@/lib/format";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Journal",
  description: "Conseils, saisons et inspirations : le journal de l’atelier Flora.",
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHeader
        eyebrow="Le journal de l’atelier"
        title={
          <>
            Des fleurs, <Em>des saisons</Em> et des idées.
          </>
        }
        intro="Conseils d’entretien, fleurs du moment et petites inspirations."
      />

      <section className="py-16">
        <Container>
          {articles.length === 0 && (
            <p className="text-center text-[16px] font-light text-ink-soft">
              Les premiers articles arrivent bientôt.
            </p>
          )}
          <div className="grid gap-10 md:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="group">
                <Link href={`/journal/${article.slug}`} aria-label={`Lire : ${article.title}`} className="block">
                  <Photo
                    src={article.image}
                    alt={article.title}
                    position={article.position}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="aspect-4/3 rounded-3xl bg-sand"
                    imgClassName="transition duration-700 group-hover:scale-105"
                  />
                </Link>
                <p className="mt-5 text-[14px] text-ink-mute">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </p>
                <h2 className="mt-2 font-display text-[30px] font-medium leading-tight">
                  <Link href={`/journal/${article.slug}`} className="transition-colors hover:text-bloom">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[15px] font-light leading-7 text-ink-soft">{article.excerpt}</p>
                <Link href={`/journal/${article.slug}`} className={`${textLink} mt-4`}>
                  Lire l’article <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
