import { notFound } from 'next/navigation';
import { getContentBySlug } from '@git-cms/content-api';
import { MdxRenderer } from '../../components/mdx-renderer';

interface PageProps {
  params: Promise<{ tenant: string; slug: string[] }>;
}

export default async function TenantPage({ params }: PageProps) {
  const { tenant, slug } = await params;
  const contentItem = getContentBySlug(tenant, slug);

  if (!contentItem) {
    notFound();
  }

  // Draft content is hidden from public routes
  if (contentItem.frontmatter.status === 'draft') {
    notFound();
  }

  // Scheduled content only visible after its scheduled time
  if (
    contentItem.frontmatter.status === 'scheduled' &&
    contentItem.frontmatter.scheduledFor &&
    new Date(contentItem.frontmatter.scheduledFor) > new Date()
  ) {
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
