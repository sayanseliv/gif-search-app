import { CircleX, Search } from 'lucide-react';
import { useState } from 'react';
const SearchSection = () => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const handleSearch = () => {};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
		}
	};
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};
	return (
		<div className='flex gap-3'>
			<div className='flex-1 relative'>
				<Search
					className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
					size={20}
				/>
				<input
					type='text'
					value={searchQuery}
					onChange={handleOnChange}
					onKeyDown={handleKeyPress}
					placeholder='Search all gifs'
					className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-400 outline-none transition-colors'
				/>
				{searchQuery.length > 0 ? (
					<CircleX className='absolute right-2 top-1/2 transform -translate-y-1/2' />
				) : null}
			</div>
		</div>
	);
};
export default SearchSection;
