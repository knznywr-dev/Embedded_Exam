import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { ModuleId, PageRef } from '../types';
import { MODULE_MAP, pageLabel } from '../data/modules';

export function SourceRef({ page, className = '' }: { page: PageRef; className?: string }) {
  return (
    <span className={`source-ref ${className}`.trim()} title={`Source: Reviewer PDF · ${pageLabel(page)}`}>
      <Icon name="book" size={13} />
      Reviewer PDF · {pageLabel(page)}
    </span>
  );
}

export function ModuleBadge({ moduleId, short = true }: { moduleId: ModuleId; short?: boolean }) {
  const meta = MODULE_MAP[moduleId];
  return (
    <span className={`module-badge accent-${meta.accent}`}>
      {short ? meta.code : meta.title}
    </span>
  );
}

export function MathText({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(\^\{[^}]+\}|_\{[^}]+\})/g);
  return (
    <span className={`math-text ${className}`.trim()}>
      {parts.map((part, index) => {
        if (part.startsWith('^{') && part.endsWith('}')) {
          return <sup key={index}>{part.slice(2, -1)}</sup>;
        }
        if (part.startsWith('_{') && part.endsWith('}')) {
          return <sub key={index}>{part.slice(2, -1)}</sub>;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}

export function Card({
  children,
  className = '',
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'article' | 'div';
}) {
  return <Tag className={`card ${className}`.trim()}>{children}</Tag>;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = 'accent',
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: 'accent' | 'success' | 'warning';
}) {
  const safeMax = max <= 0 ? 1 : max;
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));
  return (
    <div
      className={`progress-bar tone-${tone}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={value}
      aria-label={label ?? 'Progress'}
    >
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

export function EmptyState({
  icon = 'spark',
  title,
  children,
  action,
}: {
  icon?: Parameters<typeof Icon>[0]['name'];
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon name={icon} size={24} />
      </span>
      <div>
        <h3>{title}</h3>
        {children ? <div className="empty-state-copy">{children}</div> : null}
        {action ? <div className="empty-state-action">{action}</div> : null}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: Parameters<typeof Icon>[0]['name'];
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {icon ? (
          <span className="stat-icon">
            <Icon name={icon} size={17} />
          </span>
        ) : null}
      </div>
      <div className="stat-value">{value}</div>
      {hint ? <div className="stat-hint">{hint}</div> : null}
    </div>
  );
}

export function Callout({
  tone,
  title,
  children,
  icon,
}: {
  tone: 'info' | 'important' | 'warning' | 'lab' | 'note';
  title?: string;
  children: ReactNode;
  icon?: Parameters<typeof Icon>[0]['name'];
}) {
  const defaultIcon =
    tone === 'warning' || tone === 'important'
      ? 'warning'
      : tone === 'lab'
        ? 'flask'
        : tone === 'note'
          ? 'bulb'
          : 'info';
  return (
    <div className={`callout callout-${tone}`}>
      <span className="callout-icon">
        <Icon name={icon ?? defaultIcon} size={18} />
      </span>
      <div>
        {title ? <strong className="callout-title">{title}</strong> : null}
        <div className="callout-body">{children}</div>
      </div>
    </div>
  );
}
