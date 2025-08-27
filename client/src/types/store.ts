import type { GifData, SearchParams } from './gif';

export interface GifStore {
  // State
  searchQuery: string;
  searchHistory: string[];
  selectedGif: GifData | null;
  searchParams: SearchParams;
  isDetailModalOpen: boolean;
  suggestions: string[];
  showSuggestions: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  clearSearchQuery: () => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setSuggestions: (suggestions: string[]) => void;
  setShowSuggestions: (show: boolean) => void;
  setSelectedGif: (gif: GifData | null) => void;
  setSearchParams: (params: Partial<SearchParams>) => void;
  openDetailModal: (gif: GifData) => void;
  closeDetailModal: () => void;
  downloadGif: (gif: GifData) => Promise<void>;
}
