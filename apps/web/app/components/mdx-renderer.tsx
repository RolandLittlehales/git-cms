import { MDXRemote } from 'next-mdx-remote/rsc';
import { componentRegistry } from '@git-cms/cms-components';

interface MdxRendererProps {
  source: string;
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <MDXRemote source={source} components={componentRegistry} />
    </div>
  );
}
