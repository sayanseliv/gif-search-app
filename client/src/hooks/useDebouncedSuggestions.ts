import React from 'react';
import { useSuggestions } from './useGifQueries';

export const useDebouncedSuggestions = (query: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  return useSuggestions({ q: debouncedQuery, limit: 8 });
};
