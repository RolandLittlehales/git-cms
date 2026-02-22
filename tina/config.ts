import { defineConfig, type Template, type TinaField } from 'tinacms';
import brandAConfig from '../content/brand-a/config.json';
import brandBConfig from '../content/brand-b/config.json';

// -- Component templates for the rich-text editor --

const buttonTemplate: Template = {
  name: 'Button',
  label: 'Button',
  fields: [
    {
      name: 'intent',
      label: 'Intent',
      type: 'string',
      options: ['primary', 'secondary', 'outline'],
    },
    {
      name: 'size',
      label: 'Size',
      type: 'string',
      options: ['sm', 'md', 'lg'],
    },
    {
      name: 'label',
      label: 'Button Text',
      type: 'string',
      required: true,
    },
    {
      name: 'url',
      label: 'URL',
      type: 'string',
      required: true,
    },
  ],
};

const calloutTemplate: Template = {
  name: 'Callout',
  label: 'Callout',
  fields: [
    {
      name: 'intent',
      label: 'Intent',
      type: 'string',
      options: ['info', 'success', 'warning', 'error'],
    },
    {
      name: 'children',
      label: 'Content',
      type: 'rich-text',
    },
  ],
};

const mediaCardTemplate: Template = {
  name: 'MediaCard',
  label: 'Media Card',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'string',
      required: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'image',
    },
  ],
};

const tableTemplate: Template = {
  name: 'Table',
  label: 'Table',
  fields: [
    {
      name: 'children',
      label: 'Table Content',
      type: 'rich-text',
    },
  ],
};

// -- Template registry derived from a single source array --

const allTemplates: Template[] = [
  buttonTemplate,
  calloutTemplate,
  mediaCardTemplate,
  tableTemplate,
];

const templatesByName: Record<string, Template> = Object.fromEntries(
  allTemplates.map((template) => [template.name, template]),
);

type ComponentName = keyof typeof templatesByName;

// -- Per-tenant configuration --

const tenants = [
  {
    id: 'brand-a',
    collectionName: 'brandA',
    label: 'Brand A',
    config: brandAConfig,
  },
  {
    id: 'brand-b',
    collectionName: 'brandB',
    label: 'Brand B',
    config: brandBConfig,
  },
] as const;

function getTemplatesForTenant(tenantId: string): Template[] {
  const tenant = tenants.find((t) => t.id === tenantId);
  const allowedComponents: readonly string[] | undefined =
    tenant?.config.allowedComponents;

  if (!allowedComponents) {
    return [];
  }

  return allowedComponents
    .filter((name) => {
      if (!(name in templatesByName)) {
        console.warn(
          `[tina] Unknown component "${name}" in allowedComponents for tenant "${tenantId}" — skipping`,
        );
        return false;
      }
      return true;
    })
    .map((name) => templatesByName[name as ComponentName]);
}

// -- Shared page fields used by every tenant collection --

const basePageFields: TinaField[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'string',
    isTitle: true,
    required: true,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'string',
    options: ['draft', 'published', 'scheduled'],
  },
  {
    name: 'publishedAt',
    label: 'Published At',
    type: 'datetime',
  },
  {
    name: 'scheduledFor',
    label: 'Scheduled For',
    type: 'datetime',
  },
  {
    name: 'updatedAt',
    label: 'Updated At',
    type: 'datetime',
  },
  {
    name: 'author',
    label: 'Author',
    type: 'string',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'string',
    ui: {
      component: 'textarea',
    },
  },
];

function buildPageFields(templates: Template[]): TinaField[] {
  return [
    ...basePageFields,
    {
      name: 'body',
      label: 'Body',
      type: 'rich-text',
      isBody: true,
      templates: templates.length > 0 ? templates : undefined,
    },
  ];
}

// -- Collection factory to avoid duplication across tenants --

function createTenantPageCollection(
  tenantId: string,
  collectionName: string,
  label: string,
) {
  const templates = getTemplatesForTenant(tenantId);

  return {
    name: `${collectionName}_pages`,
    label: `${label} Pages`,
    path: `content/${tenantId}/pages`,
    format: 'mdx' as const,
    fields: buildPageFields(templates),
    ui: {
      router: ({ document }: { document: { _sys: { filename: string } } }) =>
        `/${tenantId}/${document._sys.filename}`,
    },
  };
}

// -- Tina config --

export default defineConfig({
  branch: 'main',
  build: {
    publicFolder: 'apps/web/public',
    outputFolder: 'admin',
  },
  media: {
    tina: {
      publicFolder: 'apps/web/public',
      mediaRoot: 'images',
    },
  },
  schema: {
    collections: tenants.map((tenant) =>
      createTenantPageCollection(
        tenant.id,
        tenant.collectionName,
        tenant.label,
      ),
    ),
  },
});
