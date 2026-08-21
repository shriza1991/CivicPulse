import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title.includes('CommonGround') ? title : `${title} | CommonGround — Community Demand Intelligence`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

