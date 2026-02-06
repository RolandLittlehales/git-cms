export type ContentStatus = 'draft' | 'published' | 'scheduled';

export interface ContentFrontmatter {
  title: string;
  status: ContentStatus;
  publishedAt?: string;
  scheduledFor?: string;
  updatedAt?: string;
  author?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ContentItem {
  slug: string;
  frontmatter: ContentFrontmatter;
  content: string;
  filePath: string;
}
