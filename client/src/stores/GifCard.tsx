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
      className="relative border rounded-lg overflow-hidden hover:border-blue-400 cursor-pointer transition-colors"
      onClick={handleShowDetails}>
      <div className="absolute top-2 left-2 flex gap-1">
        {gif.type && (
          <span className="px-2 py-1 text-xs font-semibold bg-black bg-opacity-50 text-white rounded-full">
            {gif.type.toUpperCase()}
          </span>
        )}
      </div>
      {gif.images?.fixed_height && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {gif.images.fixed_height.width}×{gif.images.fixed_height.height}
        </div>
      )}
      <img
        src={gif.images.fixed_height.url}
        alt={gif.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-2">
        <p className="text-sm truncate">{gif.title || 'Untitled'}</p>
      </div>
    </div>
  );
};
export default memo(GifCard);
