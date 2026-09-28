// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Milvago',
  tagline: 'Community and Enterprise documentation',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },

  url: 'https://docs.milvago.ai',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  // Umami analytics, proxied first-party under /s/ by the production server.
  // Only added when UMAMI_WEBSITE_ID is set at build time; data-domains keeps other hosts uncounted.
  scripts: process.env.UMAMI_WEBSITE_ID
    ? [
        {
          src: '/s/script.js',
          defer: true,
          'data-website-id': process.env.UMAMI_WEBSITE_ID,
          'data-domains': 'docs.milvago.ai',
        },
      ]
    : [],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'pt-BR'],
    localeConfigs: {
      en: { label: 'English' },
      fr: { label: 'Français' },
      es: { label: 'Español' },
      'pt-BR': { label: 'Português (Brasil)' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Milvago-AI/milvago-documentation/edit/main/',
          editLocalizedFiles: true,
          admonitions: {
            keywords: ['enterprise'],
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      metadata: [
        {
          name: 'theme-color',
          content: '#111722',
        },
      ],
      navbar: {
        logo: {
          alt: 'Milvago',
          src: '/img/milvago-logo-horizontal.svg',
          srcDark: '/img/milvago-logo-horizontal-mono-white.svg',
          height: 28,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/Milvago-AI',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

