import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { findWorkspaceRoot } from '@git-cms/tenant-config';
import type { ContentItem, ContentFrontmatter } from './types';

const CONTENT_ROOT = path.join(findWorkspaceRoot(), 'content');

function tenantPagesDir(tenantId: string): string {
  return path.join(CONTENT_ROOT, tenantId, 'pages');
}

function parseMdxFile(filePath: string, slug: string): ContentItem {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return {
    slug,
    frontmatter: data as ContentFrontmatter,
    content,
    filePath,
  };
}

function collectMdxFiles(baseDir: string, currentDir: string): ContentItem[] {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      return collectMdxFiles(baseDir, fullPath);
    }

    if (!entry.name.endsWith('.mdx')) {
      return [];
    }

    const relativePath = path.relative(baseDir, fullPath);
    const slug = relativePath.replace(/\.mdx$/, '').replace(/[/\\]index$/, '');
    return [parseMdxFile(fullPath, slug)];
  });
}

function isPublishable(item: ContentItem): boolean {
  if (item.frontmatter.status === 'published') return true;

  const isScheduledAndDue =
    item.frontmatter.status === 'scheduled' &&
    item.frontmatter.scheduledFor &&
    new Date(item.frontmatter.scheduledFor) <= new Date();

  return Boolean(isScheduledAndDue);
}

export function getContentBySlug(
  tenantId: string,
  slugParts: string[]
): ContentItem | null {
  const slugPath = slugParts.join('/');
  const pagesDir = tenantPagesDir(tenantId);
  const resolvedPagesDir = path.resolve(pagesDir);

  const candidatePaths = [
    path.resolve(pagesDir, `${slugPath}.mdx`),
    path.resolve(pagesDir, slugPath, 'index.mdx'),
  ];

  const matchingPath = candidatePaths.find((candidate) =>
    candidate.startsWith(resolvedPagesDir) && fs.existsSync(candidate)
  );

  return matchingPath ? parseMdxFile(matchingPath, slugPath) : null;
}

export function getAllContent(tenantId: string): ContentItem[] {
  const pagesDir = tenantPagesDir(tenantId);
  if (!fs.existsSync(pagesDir)) {
    return [];
  }
  return collectMdxFiles(pagesDir, pagesDir);
}

export function getPublishableContent(tenantId: string): ContentItem[] {
  return getAllContent(tenantId).filter(isPublishable);
}

export function getAllSlugs(tenantId: string): string[] {
  return getAllContent(tenantId).map((item) => item.slug);
}
