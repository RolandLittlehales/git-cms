import { defineConfig, type Collection, type Template } from 'tinacms';
import brandAConfig from '../content/brand-a/config.json';
import brandBConfig from '../content/brand-b/config.json';

const tenantConfigs: Record<string, { allowedComponents?: string[] }> = {
  'brand-a': brandAConfig,
  'brand-b': brandBConfig,
};

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

// -- Map template names to template objects for per-tenant filtering --

const templatesByName: Record<string, Template> = {
  Button: buttonTemplate,
  Callout: calloutTemplate,
  MediaCard: mediaCardTemplate,
  Table: tableTemplate,
};

function getTemplatesForTenant(tenantId: string): Template[] {
  const config = tenantConfigs[tenantId];
  const allowedComponents = config?.allowedComponents;

  if (!allowedComponents) {
    return [];
  }

  return allowedComponents
    .filter((name) => name in templatesByName)
    .map((name) => templatesByName[name]);
}

// -- Shared page fields used by every tenant collection --

const basePageFields: Collection['fields'] = [
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

function buildPageFields(templates: Template[]): Collection['fields'] {
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
  label: string
): Collection {
  const templates = getTemplatesForTenant(tenantId);

  return {
    name: `${collectionName}_pages`,
    label: `${label} Pages`,
    path: `content/${tenantId}/pages`,
    format: 'mdx',
    fields: buildPageFields(templates),
    ui: {
      router: ({ document }) => `/${tenantId}/${document._sys.filename}`,
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
    collections: [
      createTenantPageCollection('brand-a', 'brandA', 'Brand A'),
      createTenantPageCollection('brand-b', 'brandB', 'Brand B'),
    ],
  },
});
