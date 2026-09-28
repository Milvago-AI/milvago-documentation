import React from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';
import styles from './styles.module.css';

const text = (key, message) => translate({id: `docs.footer.${key}`, message});

function Arrow({up = false}) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {up ? <path d="M12 19V5m-6 6 6-6 6 6" /> : <path d="M6 18 18 6M6 6h12v12" />}
  </svg>;
}

export default function Footer() {
  const {i18n: {currentLocale, defaultLocale}} = useDocusaurusContext();
  const docs = `${currentLocale === defaultLocale ? '' : `/${currentLocale}`}/docs/`;
  const licenceAnchor = {fr: 'licence', en: 'licence', es: 'licencia', 'pt-BR': 'licença'}[currentLocale];
  const logo = useBaseUrl('/img/milvago-logo-horizontal.svg');
  const logoDark = useBaseUrl('/img/milvago-logo-horizontal-mono-white.svg');
  const columns = [
    {title: text('start', 'Get started'), links: [
      [text('introduction', 'Introduction'), 'introduction/milvago'],
      [text('requirements', 'Hardware Requirements'), 'introduction/hardware-requirements'],
      [text('installation', 'Installation'), 'installation/composants'],
      [text('architecture', 'Architecture'), 'introduction/architecture'],
      [text('security', 'Security'), 'introduction/securite'],
    ]},
    {title: text('manage', 'Administration'), links: [
      [text('devices', 'Devices and groups'), 'fleet/postes'],
      [text('policies', 'Shadow AI policies'), 'administration/shadow-ai'],
      [text('observability', 'Observability'), 'administration/observabilite'],
      [text('profile', 'My profile'), 'mon-profil/profil'],
    ]},
    {title: text('resources', 'Resources'), links: [
      [text('api', 'API keys and MCP server'), 'mon-profil/cles-api'],
      [text('configuration', 'Agent configuration'), 'avance/agent-configuration'],
      [text('catalog', 'Detection catalog'), 'avance/catalogue-editeur'],
      [text('advanced', 'Advanced guides'), 'avance/'],
    ]},
  ];

  return <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.main}>
        <div className={styles.brand}>
          <Link to={docs} className={styles.logo} aria-label={`Milvago — ${text('home', 'Documentation home')}`}>
            <ThemedImage alt="Milvago" sources={{light: logo, dark: logoDark}} height={32} width={156} />
          </Link>
          <span className={styles.eyebrow}>{text('documentation', 'Product documentation')}</span>
          <p className={styles.description}>{text('description', 'Guides to deploy Milvago, understand AI usage, and administer your environment.')}</p>
          <span className={styles.editions}>{text('editions', 'Community & Enterprise')}</span>
          <a className={styles.website} href="https://www.milvago.ai/">{text('website', 'Discover Milvago')}<Arrow /></a>
        </div>
        <nav className={styles.navigation} aria-label={text('navigation', 'Documentation navigation')}>
          {columns.map((column, index) => <div key={index}>
            <h2 className={styles.heading}>{column.title}</h2>
            <ul className={styles.links}>
              {column.links.map(([label, path]) => <li key={path}><Link to={docs + path}>{label}</Link></li>)}
            </ul>
          </div>)}
        </nav>
      </div>
      <div className={styles.bottom}>
        <small>© {new Date().getFullYear()} Milvago</small>
        <div className={styles.utilities}>
          <Link to={`${docs}#${licenceAnchor}`}>{text('licences', 'Licenses')}</Link>
          <button type="button" onClick={() => {
            window.scrollTo({top: 0, behavior: 'instant'});
            const main = document.querySelector('main');
            if (main) { main.setAttribute('tabindex', '-1'); main.focus({preventScroll: true}); }
          }}>
            {text('top', 'Back to top')}<Arrow up />
          </button>
        </div>
      </div>
    </div>
  </footer>;
}
