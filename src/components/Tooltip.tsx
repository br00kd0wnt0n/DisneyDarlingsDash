import type { ReactNode } from 'react';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { getGlossaryTerm } from '../data/glossary';
import { getDataSourceInfo } from '../data/dataSources';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
      )}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg whitespace-nowrap max-w-xs ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}
          />
        </div>
      )}
    </div>
  );
}

interface GlossaryTooltipProps {
  term: string;
  children?: ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const definition = getGlossaryTerm(term);
  if (!definition) return <>{children || term}</>;

  return (
    <Tooltip content={definition}>
      <span className="border-b border-dotted border-gray-400 cursor-help">
        {children || term}
      </span>
    </Tooltip>
  );
}

interface SourceIndicatorProps {
  field: string;
  showLabel?: boolean;
}

export function SourceIndicator({ field, showLabel = false }: SourceIndicatorProps) {
  const source = getDataSourceInfo(field);

  return (
    <Tooltip content={source.label}>
      <span className={`source-indicator ${
        source.color === '#22c55e' ? 'source-client' :
        source.color === '#3b82f6' ? 'source-industry' :
        'source-ralph'
      }`}>
        {source.icon}
        {showLabel && <span className="ml-1">{source.label}</span>}
      </span>
    </Tooltip>
  );
}
