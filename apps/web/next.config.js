//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  transpilePackages: [
    '@git-cms/content-api',
    '@git-cms/cms-components',
    '@git-cms/theme',
    '@git-cms/tenant-config',
  ],
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
