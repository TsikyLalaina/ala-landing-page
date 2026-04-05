import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ExpandableText = ({ content, maxLength = 200, style, className }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  if (content.length <= maxLength) {
    return <p style={style} className={className}>{content}</p>;
  }

  const displayText = isExpanded ? content : `${content.substring(0, maxLength)}...`;

  return (
    <div style={{ marginBottom: style?.marginBottom }}>
      <p style={{ ...style, marginBottom: 0 }} className={className}>
        {displayText}
      </p>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#A7C7BC',
          cursor: 'pointer',
          padding: '4px 0',
          fontSize: '14px',
          fontWeight: '600',
          display: 'block',
          marginTop: '4px'
        }}
      >
        {isExpanded ? t('common.show_less', 'Show less') : t('common.show_more', 'Show more')}
      </button>
    </div>
  );
};
