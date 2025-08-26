import { CircleX, Search, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { SuggestionsList } from './SuggestionsList';
import { useGifStore } from '../../stores/gifStore';
import { useDebouncedSuggestions } from '../../hooks/useDebouncedSuggestions';
const SearchSection = () => {
	const {
		searchQuery,
		setSearchQuery,
		clearSearchQuery,
		addToSearchHistory,
		setSearchParams,
		showSuggestions,
		setShowSuggestions,
	} = useGifStore();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const { data: suggestionsData } = useDebouncedSuggestions(searchQuery, 300);

	const suggestions = suggestionsData?.data?.map((item) => item.name) || [];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setShowSuggestions]);

	const handleSearch = async (query?: string) => {
		const searchTerm = query || searchQuery;

		if (!searchTerm.trim()) return;

		setIsLoading(true);
		setShowSuggestions(false);

		try {
			addToSearchHistory(searchTerm);

			setSearchParams({
				q: searchTerm,
				limit: 25,
				offset: 0,
			});

			console.log('Searching for:', searchTerm);
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClean = () => {
		clearSearchQuery();
		setShowSuggestions(false);
		inputRef.current?.focus();
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		} else if (e.key === 'Escape') {
			setShowSuggestions(false);
			inputRef.current?.blur();
		}
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		if (value.length >= 2) {
			setShowSuggestions(true);
		} else {
			setShowSuggestions(false);
		}
	};

	const handleFocus = () => {
		if (searchQuery.length >= 2) {
			setShowSuggestions(true);
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion);
		setShowSuggestions(false);
		handleSearch(suggestion);
	};

	return (
		<div className='flex w-full gap-3 sm:max-w-lg order-last sm:order-none'>
			<div className='relative flex-1' ref={containerRef}>
				<Search
					className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10'
					size={20}
				/>
				<input
					ref={inputRef}
					type='text'
					value={searchQuery}
					onChange={handleOnChange}
					onKeyDown={handleKeyPress}
					onFocus={handleFocus}
					placeholder='Search all gifs'
					className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-blue-400 outline-none transition-colors'
					autoComplete='off'
					aria-label='Search GIFs'
				/>

				{searchQuery.length > 0 && (
					<button
						onClick={handleClean}
						className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors z-10'
						aria-label='Clear search'>
						<CircleX size={20} />
					</button>
				)}

				<SuggestionsList
					suggestions={suggestions}
					isVisible={showSuggestions}
					onSuggestionClick={handleSuggestionClick}
				/>
			</div>

			<button
				onClick={() => handleSearch()}
				disabled={isLoading || !searchQuery.trim()}
				className='flex items-center justify-center px-3 py-2 bg-gray-900 hover:bg-blue-400 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium min-w-[48px]'
				aria-label='Search'>
				{isLoading ? (
					<Loader2 className='w-5 h-5 animate-spin' />
				) : (
					<Search className='w-5 h-5' />
				)}
			</button>
		</div>
	);
};
export default SearchSection;
