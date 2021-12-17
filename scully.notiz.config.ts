import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';

import '@notiz/scully-plugin-lazy-images';
import '@notiz/scully-plugin-copy-static-content';
import '@notiz/scully-plugin-fouc';
// import '@notiz/scully-plugin-rss';
import '@notiz/scully-plugin-medium-zoom';
import './projects/banner-generator';
import '@notiz/shortcodes/plugin/plugin';
import { NotionDom, NotionDomPluginOptions, NotionDomRouter, NotionDomRouterPluginOptions } from '@notion-stuff/scully-plugin-notion';

import {
  getSitemapPlugin,
  SitemapConfig,
} from '@gammastream/scully-plugin-sitemap';

const defaultPostRenderers = [
  'fouc',
  'seoHrefOptimise',
  'lazyImages',
  'mediumZoom',
  'copyStaticContent',
  'shortcodes',
];

const SitemapPlugin = getSitemapPlugin();
const sitemapConfig: SitemapConfig = {
  urlPrefix: 'https://makemecode.com',
  sitemapFilename: 'sitemap.xml',
  changeFreq: 'weekly',
  priority: [
    '1.0',
    '0.9',
    '0.8',
    '0.7',
    '0.6',
    '0.5',
    '0.4',
    '0.3',
    '0.2',
    '0.1',
    '0.0',
  ],
  ignoredRoutes: ['/404', '/confirm-subscription', '/unsubscribe'],
  routes: {
    '/blog/:slug': {
      changeFreq: 'daily',
      priority: '0.9',
      sitemapFilename: 'sitemap-blog.xml',
    },
    '/tags/:slug': {
      changeFreq: 'daily',
      priority: '0.9',
      sitemapFilename: 'sitemap-tags.xml',
    },
  },
};
setPluginConfig(SitemapPlugin, sitemapConfig);
setPluginConfig(NotionDom, {notionBlocksHtmlParserOptions: {mdHighlightingOptions: 'prismjs'}} as NotionDomPluginOptions);

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'notiz',
  defaultPostRenderers,
  outDir: './dist/static',
  routes: {
    '/blog/:slug': {
      type: NotionDomRouter,
      databaseId: '9314d16faf824a91b1195bbdb241c51b',
      postRenderers: [NotionDom, 'bannerGenerator'],
      basePath: '/blog',
    } as NotionDomRouterPluginOptions,
    '/authors/:slug': {
      type: NotionDomRouter,
      basePath: '/authors',
      databaseId: '6f586fc353d847f6bae7c9c8d7bfbad2',
      postRenderers: [NotionDom]
    } as NotionDomRouterPluginOptions,
    '/tags/:slug': {
      type: NotionDomRouter,
      databaseId: 'b7e984d7726247888dfdba6dafaf8d9e',
      basePath: '/tags',
      postRenderers: [NotionDom],
    } as NotionDomRouterPluginOptions,
    '/legal/:slug': {
      type: NotionDomRouter,
      databaseId: '9268554d0f5741bf892b0662c80ee27a',
      basePath: '/legal',
      postRenderers: [NotionDom],
    } as NotionDomRouterPluginOptions,
  },
};
