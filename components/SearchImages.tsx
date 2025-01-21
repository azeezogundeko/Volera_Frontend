/* eslint-disable @next/next/no-img-element */
import { ImageIcon, PlusIcon, PlayCircle, Video } from 'lucide-react';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './ChatWindow';
import clsx from 'clsx';
import Image from 'next/image';

export type Image = {
  url: string;
  img_url: string;
  title: string;
};

const VideoSearchButton = ({ onSearch, isLoading }: { onSearch: () => void, isLoading: boolean }) => {
  return (
    <button
      onClick={onSearch}
      disabled={isLoading}
      className={clsx(
        "w-full mt-4 p-3 rounded-xl flex items-center justify-center gap-2",
        "bg-light-100 dark:bg-dark-100 hover:bg-light-200 dark:hover:bg-dark-200",
        "transition-all duration-300 group",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <Video className={clsx(
        "w-5 h-5 text-black/70 dark:text-white/70",
        "transition-all duration-300",
        "group-hover:scale-110"
      )} />
      <span className="text-sm font-medium text-black/70 dark:text-white/70">
        {isLoading ? "Searching videos..." : "Search Related Videos"}
      </span>
      {isLoading && (
        <div className="w-4 h-4 rounded-full border-2 border-black/20 dark:border-white/20 border-t-black/70 dark:border-t-white/70 animate-spin ml-2" />
      )}
    </button>
  );
};

const ImageCard = ({ 
  image, 
  onClick, 
  className,
  delay = 0
}: { 
  image: Image; 
  onClick: () => void; 
  className?: string;
  delay?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 300 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={clsx(
        "relative overflow-hidden cursor-zoom-in bg-light-100 dark:bg-dark-100 group",
        "transition-all duration-500 ease-in-out",
        !show && "opacity-0 translate-y-4",
        show && "opacity-100 translate-y-0",
        className
      )}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-light-200 dark:bg-dark-200">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-light-300 dark:border-dark-300 border-t-transparent animate-spin mb-2" />
            <p className="text-xs text-light-300 dark:text-dark-300 animate-pulse">Loading image...</p>
          </div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-light-200 dark:bg-dark-200">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-light-300 dark:text-dark-300" />
            <p className="text-xs text-light-300 dark:text-dark-300">Failed to load image</p>
          </div>
        </div>
      ) : (
        <Image
          src={image.img_url}
          alt={image.title}
          width={400}
          height={300}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={clsx(
            "absolute inset-0 w-full h-full object-cover",
            "transition-all duration-700",
            "group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => {
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
      )}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent",
        "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
      )}>
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 drop-shadow-lg bg-black/30 p-2 rounded-lg">{image.title}</p>
        </div>
      </div>
    </div>
  );
};

const SearchImages = ({
  images,
  loading,
  onSearchVideos,
  messageId,
}: {
  images: Image[] | null;
  loading: boolean;
  onSearchVideos?: () => Promise<void>;
  messageId: string;
}) => {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [selectedIndices, setSelectedIndices] = useState<Record<string, number>>({});
  const [showImagesOnMobile, setShowImagesOnMobile] = useState<Record<string, boolean>>({});
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    if (messageId && !openStates.hasOwnProperty(messageId)) {
      setOpenStates(prev => ({ ...prev, [messageId]: false }));
      setSelectedIndices(prev => ({ ...prev, [messageId]: 0 }));
      setShowImagesOnMobile(prev => ({ ...prev, [messageId]: false }));
    }
  }, [messageId]);

  useEffect(() => {
    if (images) {
      setSlides(
        images.map((image: Image) => ({
          src: image.img_url,
        }))
      );
    }
  }, [images]);

  const handleVideoSearch = async () => {
    if (onSearchVideos) {
      setIsSearchingVideos(true);
      try {
        await onSearchVideos();
      } finally {
        setIsSearchingVideos(false);
      }
    }
  };

  const toggleMobileView = () => {
    setShowImagesOnMobile(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  if (!loading && images === null) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Search Results</h3>
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 aspect-[2/1] rounded-xl bg-gradient-to-br from-light-200 to-light-300 dark:from-dark-200 dark:to-dark-300 animate-pulse" />
          <div className="aspect-square rounded-xl bg-gradient-to-br from-light-200 to-light-300 dark:from-dark-200 dark:to-dark-300 animate-pulse" />
          <div className="aspect-square rounded-xl bg-gradient-to-br from-light-200 to-light-300 dark:from-dark-200 dark:to-dark-300 animate-pulse" />
          <div className="aspect-square rounded-xl bg-gradient-to-br from-light-200 to-light-300 dark:from-dark-200 dark:to-dark-300 animate-pulse" />
          <div className="aspect-square rounded-xl bg-gradient-to-br from-light-200 to-light-300 dark:from-dark-200 dark:to-dark-300 animate-pulse" />
        </div>
      </div>
    );
  }

  if (images && images.length > 0) {
    return (
      <div className="bg-white dark:bg-dark-100 rounded-xl border border-gray-200 dark:border-dark-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-dark-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <h3 className="font-medium text-sm text-black/90 dark:text-white/90">Visual Results</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              {images.length}
            </span>
          </div>
        </div>

        <button onClick={toggleMobileView} className="mt-2 text-sm text-blue-500 block sm:hidden">
          {showImagesOnMobile[messageId] ? "Hide Images" : "Show Images"}
        </button>

        <div className={clsx(
          "transition-all duration-300 ease-in-out",
          "hidden sm:block",
          showImagesOnMobile[messageId] && "block"
        )}>
          <div className="p-3 grid gap-2">
            {/* Featured Image */}
            <ImageCard 
              image={images[0]}
              className="aspect-video rounded-lg"
              onClick={() => {
                setSelectedIndices(prev => ({ ...prev, [messageId]: 0 }));
                setOpenStates(prev => ({ ...prev, [messageId]: true }));
              }}
              delay={0}
            />
            
            {/* Grid Images */}
            <div className="grid grid-cols-2 gap-2">
              {images.slice(1, 5).map((image, i) => (
                <ImageCard
                  key={i}
                  image={image}
                  className="aspect-square rounded-lg"
                  onClick={() => {
                    setSelectedIndices(prev => ({ ...prev, [messageId]: i + 1 }));
                    setOpenStates(prev => ({ ...prev, [messageId]: true }));
                  }}
                  delay={(i + 1) * 100}
                />
              ))}
            </div>

            {/* See More Button */}
            {images.length > 5 && (
              <button
                className={clsx(
                  "w-full p-2 rounded-lg text-center",
                  "bg-light-100 dark:bg-dark-200 hover:bg-light-200 dark:hover:bg-dark-300",
                  "transition-all duration-300 text-sm"
                )}
                onClick={() => {
                  setSelectedIndices(prev => ({ ...prev, [messageId]: 5 }));
                  setOpenStates(prev => ({ ...prev, [messageId]: true }));
                }}
              >
                View {images.length - 5} more images
              </button>
            )}
          </div>

          {onSearchVideos && (
            <div className="p-3 pt-0">
              <VideoSearchButton 
                onSearch={handleVideoSearch}
                isLoading={isSearchingVideos}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SearchImages;
