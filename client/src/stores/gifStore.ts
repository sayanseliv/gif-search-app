import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GifData, SearchParams } from '../types/gif';
import type { GifStore } from '../types/store';
import {
  DEFAULT_SEARCH_PARAMS,
  GIF_STORE_NAME,
  MAX_SEARCH_HISTORY,
} from '../constants/gif';

export const useGifStore = create<GifStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        searchQuery: '',
        searchHistory: [],
        selectedGif: null,
        searchParams: DEFAULT_SEARCH_PARAMS,
        isDetailModalOpen: false,
        suggestions: [],
        showSuggestions: false,

        // Actions
        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, 'setSearchQuery');
        },

        clearSearchQuery: () => {
          set(
            {
              searchQuery: '',
              showSuggestions: false,
              searchParams: DEFAULT_SEARCH_PARAMS,
            },
            false,
            'clearSearchQuery'
          );
        },

        addToSearchHistory: (query: string) => {
          set(
            (state) => {
              const newHistory = [
                query,
                ...state.searchHistory.filter((q) => q !== query),
              ].slice(0, MAX_SEARCH_HISTORY);
              return { searchHistory: newHistory };
            },
            false,
            'addToSearchHistory'
          );
        },

        clearSearchHistory: () => {
          set({ searchHistory: [] }, false, 'clearSearchHistory');
        },

        setSuggestions: (suggestions: string[]) => {
          set({ suggestions }, false, 'setSuggestions');
        },

        setShowSuggestions: (show: boolean) => {
          set({ showSuggestions: show }, false, 'setShowSuggestions');
        },

        setSelectedGif: (gif: GifData | null) => {
          set({ selectedGif: gif }, false, 'setSelectedGif');
        },

        setSearchParams: (params: Partial<SearchParams>) => {
          set(
            (state) => ({
              searchParams: { ...state.searchParams, ...params },
            }),
            false,
            'setSearchParams'
          );
        },

        openDetailModal: (gif: GifData) => {
          set(
            { selectedGif: gif, isDetailModalOpen: true },
            false,
            'openDetailModal'
          );
        },

        closeDetailModal: () => {
          set(
            { isDetailModalOpen: false, selectedGif: null },
            false,
            'closeDetailModal'
          );
        },

        downloadGif: async (gif: GifData) => {
          try {
            const response = await fetch(gif.images.original.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${gif.slug || gif.id}.gif`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Failed to download GIF:', error);
          }
        },
      }),
      {
        name: GIF_STORE_NAME,
        partialize: (state) => ({
          searchHistory: state.searchHistory,
          searchParams: state.searchParams,
        }),
      }
    ),
    { name: 'GifStore' }
  )
);
