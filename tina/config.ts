import { defineConfig, type Collection, type Template } from 'tinacms';

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

const componentTemplates: Template[] = [
  buttonTemplate,
  calloutTemplate,
  mediaCardTemplate,
  tableTemplate,
];

// -- Shared page fields used by every tenant collection --

const pageFields: Collection['fields'] = [
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
  {
    name: 'body',
    label: 'Body',
    type: 'rich-text',
    isBody: true,
    templates: componentTemplates,
  },
];

// -- Collection factory to avoid duplication across tenants --

function createTenantPageCollection(
  tenantId: string,
  collectionName: string,
  label: string
): Collection {
  return {
    name: `${collectionName}_pages`,
    label: `${label} Pages`,
    path: `content/${tenantId}/pages`,
    format: 'mdx',
    fields: pageFields,
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
