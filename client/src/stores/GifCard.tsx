import { memo } from 'react';
import type { GifData } from '../types/gif';

type GifCardProps = {
	gif: GifData;
	onShowDetails?: (gif: GifData) => void;
};

const GifCard: React.FC<GifCardProps> = ({ gif, onShowDetails }) => {
	const handleShowDetails = () => onShowDetails?.(gif);
	return (
		<div
			className='border rounded-lg overflow-hidden hover:border-blue-400 cursor-pointer transition-colors'
			onClick={handleShowDetails}>
			<img
				src={gif.images.fixed_height.url}
				alt={gif.title}
				className='w-full h-48 object-cover'
			/>
			<div className='p-2'>
				<p className='text-sm truncate'>{gif.title || 'Untitled'}</p>
			</div>
		</div>
	);
};
export default memo(GifCard);
