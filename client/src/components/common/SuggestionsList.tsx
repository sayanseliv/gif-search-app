import React from 'react';
import { useGifStore } from '../../stores/gifStore';

interface SuggestionsListProps {
	suggestions: string[];
	isVisible: boolean;
	onSuggestionClick: (suggestion: string) => void;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
	suggestions,
	isVisible,
	onSuggestionClick,
}) => {
	const { searchHistory } = useGifStore();

	if (!isVisible || suggestions.length === 0) {
		return null;
	}

	return (
		<div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'>
			{suggestions.length === 0 && searchHistory.length > 0 && (
				<div className='p-2'>
					<div className='text-xs text-gray-500 font-medium mb-2 px-2'>
						Recent searches
					</div>
					{searchHistory.slice(0, 5).map((item, index) => (
						<button
							key={`history-${index}`}
							onClick={() => onSuggestionClick(item)}
							className='w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm transition-colors'>
							<span className='text-gray-600'>🕐</span> {item}
						</button>
					))}
				</div>
			)}

			{suggestions.length > 0 && (
				<div className='p-2'>
					<div className='text-xs text-gray-500 font-medium mb-2 px-2'>Suggestions</div>
					{suggestions.map((suggestion, index) => (
						<button
							key={`suggestion-${index}`}
							onClick={() => onSuggestionClick(suggestion)}
							className='w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm transition-colors flex items-center gap-2'>
							<span className='text-gray-400'>🔍</span>
							<span className='truncate text-gray-900'>{suggestion}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
