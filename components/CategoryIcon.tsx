import React from 'react';

interface CategoryIconProps {
  categoryId: string;
  className?: string;
}

export function CategoryIcon({ categoryId, className = 'w-6 h-6' }: CategoryIconProps) {
  const baseClasses = `${className} fill-current`;

  switch (categoryId) {
    case 'soups':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10h12c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2z" opacity="0.3"/>
          <path d="M8 5c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v2H8V5z"/>
          <path d="M7 8.5c.3-.5.9-1 1.5-1h7c.6 0 1.2.5 1.5 1"/>
          <path d="M9 13s.5 1.5 3 1.5 3-1.5 3-1.5"/>
        </svg>
      );

    case 'salads':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M6 7h12v10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7z" opacity="0.3"/>
          <path d="M12 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          <path d="M7 6c.8 1.2 1.5 2 2 2.5"/>
          <path d="M17 6c-.8 1.2-1.5 2-2 2.5"/>
          <circle cx="9" cy="11" r="1"/>
          <circle cx="15" cy="13" r="1"/>
          <path d="M12 9c1.5 1.5 2 3 2 4"/>
        </svg>
      );

    case 'continental':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8v3h4V8H4z" opacity="0.3"/>
          <path d="M8 8v3h4V8H8z" opacity="0.3"/>
          <path d="M12 8v3h4V8h-4z" opacity="0.3"/>
          <path d="M16 8v3h4V8h-4z" opacity="0.3"/>
          <rect x="4" y="12" width="16" height="1.5" opacity="0.2"/>
          <path d="M6 13h2v4H6zM10 13h2v4h-2zM14 13h2v4h-2zM18 13h2v4h-2z"/>
        </svg>
      );

    case 'tandoori-veg':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3c-5 0-8 3-8 8s3 8 8 8 8-3 8-8-3-8-8-8z" opacity="0.3"/>
          <path d="M12 6c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>
          <path d="M8 10s-.5 1-1 2"/>
          <path d="M16 10s.5 1 1 2"/>
          <path d="M11 14c.3.5.7.8 1 .8s.7-.3 1-.8"/>
        </svg>
      );

    case 'tandoori-non-veg':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 4c-2 0-3.5 2-3.5 4.5 0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-2.5-1.5-4.5-3.5-4.5-1.5 0-3 1-3.5 2.5-.5-1.5-2-2.5-3.5-2.5z" opacity="0.4"/>
          <path d="M12 8c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z"/>
        </svg>
      );

    case 'platters':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" opacity="0.2"/>
          <circle cx="8" cy="10" r="2.5" opacity="0.6"/>
          <circle cx="12" cy="10" r="2.5"/>
          <circle cx="16" cy="10" r="2.5" opacity="0.6"/>
          <circle cx="10" cy="15" r="2" opacity="0.5"/>
          <circle cx="14" cy="15" r="2" opacity="0.5"/>
        </svg>
      );

    case 'chinese-starters':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8h3v8H4z" opacity="0.3"/>
          <path d="M9 8h3v8H9z" opacity="0.3"/>
          <path d="M14 8h3v8h-3z" opacity="0.3"/>
          <path d="M19 8h1v8h-1z" opacity="0.3"/>
          <path d="M5 18h14v1H5z"/>
          <path d="M6 8v8M12 8v8M18 8v8" strokeWidth="0.5" stroke="currentColor" fill="none"/>
        </svg>
      );

    case 'main-veg':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" opacity="0.2"/>
          <path d="M12 5v14M5 12h14"/>
          <path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>
        </svg>
      );

    case 'main-non-veg':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="8" ry="7" opacity="0.2"/>
          <path d="M9 9l6 6M15 9l-6 6"/>
          <path d="M7 12a5 5 0 0110 0"/>
        </svg>
      );

    case 'biryani':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8h12v10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8z" opacity="0.2"/>
          <path d="M7 6h10M6.5 8h11M8 10l-.5 1 .5 1M12 10l-.5 1 .5 1M16 10l-.5 1 .5 1"/>
          <path d="M7 15h10"/>
        </svg>
      );

    case 'pizza':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L21 18H3Z" opacity="0.2"/>
          <path d="M12 3L21 18M12 3L3 18"/>
          <path d="M12 3v15"/>
          <circle cx="12" cy="12" r="1.5" opacity="0.6"/>
          <circle cx="14" cy="11" r="1" opacity="0.4"/>
        </svg>
      );

    case 'pasta':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10c0-2 4-4 8-4s8 2 8 4v6c0 2-4 4-8 4s-8-2-8-4v-6z" opacity="0.2"/>
          <path d="M5 10c0-1.5 3-3 7-3s7 1.5 7 3"/>
          <path d="M5 10v4c0 1.5 3 3 7 3s7-1.5 7-3v-4"/>
          <path d="M6 11s2 2 6 2 6-2 6-2"/>
        </svg>
      );

    case 'desserts':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M6 15h12v3c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-3z" opacity="0.2"/>
          <path d="M7 10c0-2.5 2-4 5-4s5 1.5 5 4H7z"/>
          <path d="M6 15h12v3c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-3z"/>
          <circle cx="10" cy="12" r="1" opacity="0.6"/>
          <circle cx="14" cy="12" r="1" opacity="0.6"/>
        </svg>
      );

    case 'beverages':
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4h8v2H8V4z"/>
          <path d="M7 6h10v10c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V6z" opacity="0.2"/>
          <path d="M7 6h10v10c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V6z"/>
          <path d="M9 8h1v6H9zM14 8h1v6h-1z" opacity="0.5"/>
          <path d="M11 14c0 .5.4 1 1 1s1-.5 1-1"/>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" className={baseClasses} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" opacity="0.2"/>
          <path d="M12 7v10M7 12h10"/>
        </svg>
      );
  }
}
