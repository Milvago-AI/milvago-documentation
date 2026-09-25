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
    {title: text('start', 'Prendre en main'), links: [
      [text('introduction', 'Présentation'), 'introduction/milvago'],
      [text('requirements', 'Prérequis technique'), 'introduction/hardware-requirements'],
      [text('installation', 'Installation'), 'installation/composants'],
      [text('architecture', 'Architecture'), 'introduction/architecture'],
      [text('security', 'Sécurité'), 'introduction/securite'],
    ]},
    {title: text('manage', 'Administrer'), links: [
      [text('devices', 'Postes et groupes'), 'fleet/postes'],
      [text('policies', 'Politiques Shadow AI'), 'administration/shadow-ai'],
      [text('observability', 'Observabilité'), 'administration/observabilite'],
      [text('profile', 'Mon profil'), 'mon-profil/profil'],
    ]},
    {title: text('resources', 'Ressources'), links: [
      [text('api', 'Clés API et serveur MCP'), 'mon-profil/cles-api'],
      [text('configuration', 'Configuration de l’agent'), 'avance/agent-configuration'],
      [text('catalog', 'Catalogue de détection'), 'avance/catalogue-editeur'],
      [text('advanced', 'Guides avancés'), 'avance/'],
    ]},
  ];

  return <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.main}>
        <div className={styles.brand}>
          <Link to={docs} className={styles.logo} aria-label={`Milvago — ${text('home', 'Accueil de la documentation')}`}>
            <ThemedImage alt="Milvago" sources={{light: logo, dark: logoDark}} height={32} width={156} />
          </Link>
          <span className={styles.eyebrow}>{text('documentation', 'Documentation produit')}</span>
          <p className={styles.description}>{text('description', 'Les guides pour déployer Milvago, comprendre les usages IA et administrer votre environnement.')}</p>
          <span className={styles.editions}>{text('editions', 'Community & Enterprise')}</span>
          <a className={styles.website} href="https://www.milvago.ai/">{text('website', 'Découvrir Milvago')}<Arrow /></a>
        </div>
        <nav className={styles.navigation} aria-label={text('navigation', 'Navigation de la documentation')}>
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
          <Link to={`${docs}#${licenceAnchor}`}>{text('licences', 'Licences')}</Link>
          <button type="button" onClick={() => {
            window.scrollTo({top: 0, behavior: 'instant'});
            const main = document.querySelector('main');
            if (main) { main.setAttribute('tabindex', '-1'); main.focus({preventScroll: true}); }
          }}>
            {text('top', 'Retour en haut')}<Arrow up />
          </button>
        </div>
      </div>
    </div>
  </footer>;
}
