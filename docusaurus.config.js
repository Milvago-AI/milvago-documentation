// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Milvago',
  tagline: 'Documentation Community et Enterprise',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },

  url: 'https://docs.milvago.ai',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'es', 'pt-BR'],
    localeConfigs: {
      fr: { label: 'Français' },
      en: { label: 'English' },
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
            href: 'https://github.com/Milvago-AI/milvago-documentation',
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

