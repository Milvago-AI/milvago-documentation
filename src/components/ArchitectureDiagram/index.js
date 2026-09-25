import React, {useId, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import labels from './labels';
import styles from './styles.module.css';

function Diagram({local, t}) {
  const id = useId().replaceAll(':', '');
  const node = (x, y, title, lines, number, accent = false) => <g key={title} transform={`translate(${x} ${y})`}>
    <rect width="240" height="126" rx="12" className={accent ? styles.primaryNode : styles.node} />
    <text x="18" y="27" className={styles.number}>{number}</text>
    <text x="18" y="57" className={styles.nodeTitle}>{title}</text>
    {lines.map((line, i) => <text key={line} x="18" y={83 + i * 21} className={styles.detail}>{line}</text>)}
  </g>;
  const edge = (d, label, x, y) => <g key={d}>
    <path d={d} className={styles.edge} markerEnd={`url(#${id}-arrow)`} />
    {label && <text x={x} y={y} textAnchor="middle" className={styles.edgeLabel}>{label}</text>}
  </g>;
  return <svg viewBox="0 0 960 560" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>{local ? t.local : t.network}</title>
    <desc id={`${id}-desc`}>{local ? t.localDescription : t.networkDescription}</desc>
    <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 9 5 0 9" fill="none" stroke="currentColor" strokeWidth="1.6" /></marker></defs>
    {local ? <path d="M28 12 H932 Q948 12 948 28 V244 Q948 260 932 260 H618 V526 Q618 542 602 542 H338 Q322 542 322 526 V260 H28 Q12 260 12 244 V28 Q12 12 28 12 Z" className={styles.zone} /> : <rect x="12" y="12" width="936" height="530" rx="16" className={styles.zone} />}
    <text x="32" y="43" className={styles.zoneLabel}>{local ? t.endpoint : `${t.outside} → ${t.private}`}</text>
    {local ? <>
      {edge('M270 164 H350', 'stdio', 310, 148)}
      {edge('M590 164 H670', 'IPC', 630, 148)}
      {edge('M150 226 V370', 'HTTPS · 443', 93, 304)}
      {edge('M790 226 V370', 'HTTPS · 443', 852, 304)}
      {edge('M235 226 V282 H470 V370', t.packagesEdge, 448, 270)}
      {node(30, 100, t.browser, t.browserLines, '01')}
      {node(350, 100, t.relay, t.relayLines, '02')}
      {node(670, 100, t.agent, t.agentLines, '03', true)}
      {node(30, 370, t.sites, t.sitesLines, 'HTTPS')}
      {node(350, 370, t.packages, t.packagesLines, '17641 / 17642 · 17651 / 17652')}
      {node(670, 370, t.remote, t.remoteLines, 'HTTPS')}
      <text x="310" y="187" textAnchor="middle" className={styles.small}>{t.stdio}</text>
      <text x="630" y="187" textAnchor="middle" className={styles.small}>{t.ipc}</text>
    </> : <>
      {edge('M270 164 H350', '443', 310, 150)}
      {edge('M590 164 H670', '4020', 630, 150)}
      {edge('M150 370 V290 H410 V226', 'HTTPS · 443', 260, 278)}
      {edge('M270 434 H350', '443²', 310, 420)}
      {edge('M730 226 V310 H500 V370', t.oidc, 607, 298)}
      {edge('M790 226 V370', t.sql, 846, 302)}
      {node(30, 100, t.device, t.deviceLines, '01')}
      {node(350, 100, t.gateway, t.gatewayLines, '02')}
      {node(670, 100, t.server, t.serverLines, '03', true)}
      {node(30, 370, t.console, t.consoleLines, '04')}
      {node(350, 370, t.identity, t.identityLines, '05')}
      {node(670, 370, t.database, t.databaseLines, '06')}
      {edge('M590 434 H670', '5432', 630, 420)}
    </>}
  </svg>;
}

export default function ArchitectureDiagram() {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const t = labels[currentLocale] || labels.fr;
  const [local, setLocal] = useState(false);
  const dialog = useRef(null);
  const content = <><Diagram local={local} t={t} /><div className={styles.enterprise}><strong>{t.enterprise}</strong><p>{local ? t.enterpriseLocal : t.enterpriseNetwork}</p></div></>;
  return <section className={styles.diagram} aria-label={t.title}>
    <header className={styles.header}><span className={styles.kicker}>MILVAGO / ARCHITECTURE</span><h2>{t.title}</h2><p>{t.intro}</p></header>
    <div className={styles.toolbar}>
      <div className={styles.switcher} role="group" aria-label={t.title}>
        <button type="button" aria-pressed={!local} onClick={() => setLocal(false)}>{t.network}</button>
        <button type="button" aria-pressed={local} onClick={() => setLocal(true)}>{t.local}</button>
      </div>
      <button type="button" className={styles.expand} onClick={() => dialog.current.showModal()}><span aria-hidden="true">↗</span> {t.enlarge}</button>
    </div>
    <p className={styles.pan}><span aria-hidden="true">↔ </span>{t.pan}</p>
    <div className={styles.canvas} tabIndex={0} role="region" aria-label={local ? t.local : t.network}>{content}</div>
    <p className={styles.caption}>{local ? t.localNote : t.networkNote}</p>
    <dialog ref={dialog} className={styles.modal} onClick={event => {if (event.target === dialog.current) dialog.current.close();}}>
      <div className={styles.modalHeader}><strong>{local ? t.local : t.network}</strong><button type="button" autoFocus onClick={() => dialog.current.close()}>{t.close} ×</button></div>
      <p className={styles.pan}><span aria-hidden="true">↔ </span>{t.pan}</p>
      <div className={styles.canvas} tabIndex={0} role="region" aria-label={local ? t.local : t.network}>{content}</div>
      <p className={styles.caption}>{local ? t.localNote : t.networkNote}</p>
    </dialog>
  </section>;
}
