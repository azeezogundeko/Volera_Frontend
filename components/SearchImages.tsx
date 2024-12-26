/* eslint-disable @next/next/no-img-element */
import { ImageIcon, PlusIcon, PlayCircle, Video } from 'lucide-react';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './ChatWindow';
import clsx from 'clsx';

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
        <img
          src={image.img_url}
          alt={image.title}
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
        "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )}>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-medium line-clamp-2">{image.title}</p>
        </div>
      </div>
    </div>
  );
};

const SearchImages = ({
  images,
  loading,
  onSearchVideos,
}: {
  images: Image[] | null;
  loading: boolean;
  onSearchVideos?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);

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
      <>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Search Results</h3>
            <span className="text-xs text-gray-500">{images.length} images</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ImageCard 
              image={images[0]}
              className="col-span-2 aspect-[2/1] rounded-xl"
              onClick={() => {
                setSelectedIndex(0);
                setOpen(true);
              }}
              delay={0}
            />
            {images.slice(1, 4).map((image, i) => (
              <ImageCard
                key={i}
                image={image}
                className="aspect-square rounded-xl"
                onClick={() => {
                  setSelectedIndex(i + 1);
                  setOpen(true);
                }}
                delay={(i + 1) * 150}
              />
            ))}
            {images.length > 4 && (
              <div
                className={clsx(
                  "relative aspect-square rounded-xl overflow-hidden cursor-pointer",
                  "bg-light-100 dark:bg-dark-100 group",
                  "transition-all duration-300"
                )}
                onClick={() => {
                  setSelectedIndex(4);
                  setOpen(true);
                }}
              >
                <img
                  src={images[4].img_url}
                  alt={images[4].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/70 transition-colors duration-300">
                  <div className="text-center">
                    <p className="text-white font-medium mb-1">See More</p>
                    <p className="text-white/70 text-sm">+{images.length - 4} images</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {onSearchVideos && (
            <VideoSearchButton 
              onSearch={handleVideoSearch}
              isLoading={isSearchingVideos}
            />
          )}
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={selectedIndex}
          slides={slides}
          styles={{
            container: { backgroundColor: 'rgba(0, 0, 0, .9)' },
          }}
        />
      </>
    );
  }

  return null;
};

export default SearchImages;
