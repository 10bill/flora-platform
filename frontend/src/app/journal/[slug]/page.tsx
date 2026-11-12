import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui/Arrow";
import { buttonClass } from "@/components/ui/buttons";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { formatDate } from "@/lib/format";
import { getArticle } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: [article.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="py-12 lg:py-16">
      <Container>
        <Link
          href="/journal"
          className="text-[14px] text-ink-mute transition hover:text-bloom"
        >
          ← Retour au journal
        </Link>

        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-[14px] text-clay">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </p>
          <h1 className="mt-5 font-display text-[44px] font-medium leading-[1.02] tracking-[-0.02em] sm:text-[64px]">
            {article.title}
          </h1>
          <p className="mt-5 text-[18px] font-light leading-8 text-ink-soft">{article.excerpt}</p>
        </header>

        <Photo
          src={article.image}
          alt={article.title}
          position={article.position}
          sizes="(min-width: 1280px) 1200px, 100vw"
          eager
          className="mx-auto mt-12 aspect-16/9 max-w-5xl rounded-4xl bg-sand"
        />

        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-[18px] font-light leading-9 text-ink-soft">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl border-t border-line pt-10 text-center">
          <p className="font-display text-[30px]">Envie de fleurs ?</p>
          <Link href="/bouquets" className={buttonClass("primary", "mt-6")}>
            Découvrir les bouquets <Arrow />
          </Link>
        </div>
      </Container>
    </article>
  );
}
