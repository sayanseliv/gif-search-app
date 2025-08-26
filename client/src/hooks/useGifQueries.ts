import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
	GifData,
	GifResponse,
	SearchParams,
	SuggestionParams,
	SuggestionResponse,
} from '../types/gif';

const API_BASE = 'http://localhost:5000/api/v1';

const searchGifs = async (params: SearchParams): Promise<GifResponse> => {
	const response = await fetch(
		`${API_BASE}/gifs/search?` +
			new URLSearchParams({
				q: params.q,
				limit: String(params.limit || 25),
				offset: String(params.offset || 0),
			})
	);

	if (!response.ok) {
		throw new Error('Failed to search GIFs');
	}

	return response.json();
};
const getTrendingGifs = async (): Promise<GifResponse> => {
	const response = await fetch(`${API_BASE}/gifs/trending`);

	if (!response.ok) {
		throw new Error('Failed to get trending GIFs');
	}

	return response.json();
};
const getGifById = async (id: string): Promise<{ data: GifData }> => {
	const response = await fetch(`${API_BASE}/gifs/gif/${id}`);
	if (!response.ok) {
		throw new Error('Failed to get GIF details');
	}
	const data = await response.json();
	return data;
};
const getSuggestions = async (params: SuggestionParams): Promise<SuggestionResponse> => {
	const response = await fetch(
		`${API_BASE}/gifs/suggestions?` +
			new URLSearchParams({
				q: params.q,
				limit: String(params.limit || 10),
			})
	);

	if (!response.ok) {
		throw new Error('Failed to get suggestions');
	}

	return response.json();
};

const apiMethods = {
	searchGifs: searchGifs,
	getTrendingGifs: getTrendingGifs,
	getGifById: getGifById,
	getSuggestions: getSuggestions,
};
export const useSearchGifs = (searchParams: SearchParams) => {
	return useQuery({
		queryKey: ['gifs', 'search', searchParams],
		queryFn: () => apiMethods.searchGifs(searchParams),
		enabled: !!searchParams.q && searchParams.q.length > 0,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
};
export const useLoadMoreSearchGifs = (searchParams: SearchParams) => {
	return useInfiniteQuery({
		queryKey: ['gifs', 'load-more-search', { q: searchParams.q, limit: searchParams.limit }],
		queryFn: ({ pageParam = 0 }) =>
			apiMethods.searchGifs({ ...searchParams, offset: pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			const nextOffset = allPages.length * (searchParams.limit || 25);
			return nextOffset < lastPage.pagination.total_count ? nextOffset : undefined;
		},
		enabled: !!searchParams.q && searchParams.q.length > 0,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		initialPageParam: 0,
	});
};

export const useGifDetails = (id: string) => {
	return useQuery({
		queryKey: ['gifs', 'details', id],
		queryFn: async () => {
			const response = await apiMethods.getGifById(id);
			return response.data;
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
	});
};
export const useSuggestions = (suggestionParams: SuggestionParams) => {
	return useQuery({
		queryKey: ['suggestions', suggestionParams],
		queryFn: () => apiMethods.getSuggestions(suggestionParams),
		enabled: !!suggestionParams.q && suggestionParams.q.length >= 2,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 30,
	});
};

export const usePrefetchGif = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (gif: GifData) => {
			if (!document.querySelector(`link[href="${gif.images.fixed_height.url}"]`)) {
				const link = document.createElement('link');
				link.rel = 'prefetch';
				link.href = gif.images.fixed_height.url;
				document.head.appendChild(link);
			}
			return gif;
		},
		onSuccess: (gif) => {
			// Cache the gif details
			queryClient.setQueryData(['gifs', 'details', gif.id], { data: gif });
		},
	});
};
