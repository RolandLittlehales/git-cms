import { notFound } from 'next/navigation';
import { getContentBySlug } from '@git-cms/content-api';
import { MdxRenderer } from '../components/mdx-renderer';

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantIndexPage({ params }: PageProps) {
  const { tenant } = await params;
  const contentItem = getContentBySlug(tenant, ['index']);

  if (!contentItem) {
    notFound();
  }

  if (contentItem.frontmatter.status === 'draft') {
    notFound();
  }

  return (
    <article>
      <h1 className="mb-6 text-4xl font-bold text-[var(--color-foreground)]">
        {contentItem.frontmatter.title}
      </h1>
      {contentItem.frontmatter.description && (
        <p className="mb-8 text-lg text-[var(--color-muted-foreground)]">
          {contentItem.frontmatter.description}
        </p>
      )}
      <MdxRenderer source={contentItem.content} />
    </article>
  );
}
