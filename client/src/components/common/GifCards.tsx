import { useState } from 'react';
import { useClipboard } from '@custom-react-hooks/use-clipboard';
import { Copy, Download, Check } from 'lucide-react';

import {
  useGifDetails,
  useLoadMoreSearchGifs,
} from '../../hooks/useGifQueries';
import type { GifData } from '../../types/gif';
import GifCard from './GifCard';
import { useGifStore } from '../../stores/gifStore';
import Modal from './Modal';

const GifCards = () => {
  const [selectedGif, setSelectedGif] = useState<GifData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { searchParams, downloadGif } = useGifStore();
  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useLoadMoreSearchGifs({
      q: searchParams?.q || '',
      limit: 9,
      offset: searchParams?.offset || 0,
    });

  const { data: gifDetails, isLoading: detailsLoading } = useGifDetails(
    selectedGif?.id || ''
  );

  const { copyToClipboard } = useClipboard();

  const showGifDetails = (gif: GifData | null) => {
    setSelectedGif(gif);
    setIsCopied(false);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGif(null);
    setIsCopied(false);
  };
  const handleCopyLink = () => {
    if (gifDetails?.images.original.url) {
      copyToClipboard(gifDetails.images.original.url);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
  const handleDownload = async () => {
    if (gifDetails) {
      await downloadGif(gifDetails);
    }
  };

  const gifs: GifData[] = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading && !gifs.length) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {(error as Error).message}
        {error.message.includes('404') && (
          <p>
            The API server is unavailable. Please check if the server is running
            on http://localhost:5000.
          </p>
        )}
      </div>
    );
  }

  if (!searchParams?.q) {
    return <div className="text-center">Enter a search term to find GIFs</div>;
  }

  if (!gifs.length) {
    return <div className="text-center">No GIF images found</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {gifs.map((gif) => (
            <GifCard gif={gif} onShowDetails={showGifDetails} key={gif.id} />
          ))}
        </div>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Load more
          </button>
        )}
      </div>
      <Modal show={isModalOpen} onClose={closeModal} direction="center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg max-w-full  w-full md:w-[90vw] md:max-w-lg">
          {detailsLoading ? (
            <div className="text-center">Loading...</div>
          ) : gifDetails ? (
            <div className="flex flex-col gap-4">
              <img
                src={gifDetails.images.fixed_height.url}
                alt={gifDetails.title}
                className="w-full h-64 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-300">
                  {gifDetails.title || 'Untitled'}
                </h2>
                <p className="text-sm text-gray-300">
                  Author: {gifDetails.username || 'Unknown'}
                </p>
                <p className="text-sm text-gray-300">
                  Creation date: {gifDetails.import_datetime || 'Not specified'}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors">
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  {isCopied ? 'Copied!' : 'Copy link'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors">
                  <Download className="w-5 h-5" />
                  Download GIF
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">Error loading</div>
          )}
        </div>
      </Modal>
    </>
  );
};
export default GifCards;
