'use client';

import { useEffect, useState } from 'react';
import { generateHeadingId } from '@/lib/utils';

interface TableOfContentsProps {
  headings: Array<{ text: string; level: number }>;
  className?: string;
}

export default function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const id = generateHeadingId(heading.text);
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={`sticky top-4 ${className}`}
      aria-label="Table of contents"
      role="navigation"
    >
      <h2 className="text-lg font-semibold mb-4 text-stone-800">Table of Contents</h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading, index) => {
          const id = generateHeadingId(heading.text);
          const isActive = activeId === id;
          const indentClass = heading.level === 3 ? 'ml-4' : '';

          return (
            <li key={index} className={indentClass}>
              <a
                href={`#${id}`}
                className={`block py-1 px-2 rounded transition-colors ${
                  isActive
                    ? 'bg-stone-200 text-stone-900 font-medium'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(id);
                  if (element) {
                    const offset = 80; // Account for sticky header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth',
                    });

                    // Update URL without scrolling
                    window.history.pushState(null, '', `#${id}`);
                  }
                }}
                data-testid={`toc-link-${id}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

