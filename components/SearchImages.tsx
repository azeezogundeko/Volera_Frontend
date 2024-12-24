/* eslint-disable @next/next/no-img-element */
import { ImagesIcon, PlusIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './ChatWindow';

type Image = {
  url: string;
  img_src: string;
  title: string;
};

const SearchImages = ({
  images,
  loading,
}: {
  images: Image[] | null;
  loading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    if (images) {
      setSlides(
        images.map((image: Image) => ({
          src: image.img_src,
        }))
      );
    }
  }, [images]);

  if (!loading && images === null) {
    return (
      <button
        className="border border-dashed border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg dark:text-white text-sm w-full"
      >
        <div className="flex flex-row items-center space-x-2">
          <ImagesIcon size={17} />
          <p>Search images</p>
        </div>
        <PlusIcon className="text-[#24A0ED]" size={17} />
      </button>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-light-secondary dark:bg-dark-secondary h-32 w-full rounded-lg animate-pulse aspect-video object-cover"
          />
        ))}
      </div>
    );
  }

  if (images !== null && images.length > 0) {
    return (
      <>
        <div className="grid grid-cols-2 gap-2 mt-16">
          {images.slice(0, 3).map((image, i) => (
            <img
              onClick={() => {
                setOpen(true);
                setSlides([
                  slides[i],
                  ...slides.slice(0, i),
                  ...slides.slice(i + 1),
                ]);
              }}
              key={i}
              src={image.img_src}
              alt={image.title}
              className="h-32 w-full object-contain object-top rounded-lg transition duration-200 active:scale-95 hover:scale-[1.02] cursor-zoom-in"
            />
          ))}
          {images.length > 3 && (
            <button
              onClick={() => setOpen(true)}
              className="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 active:scale-95 hover:scale-[1.02] h-32 w-full rounded-lg flex flex-col justify-between p-2"
            >
              <div className="grid grid-cols-3 gap-1 h-full w-full">
                {images.slice(3, 6).map((image, i) => (
                  <img
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-full w-full object-contain object-center rounded-sm"
                  />
                ))}
              </div>
              <p className="text-black/70 dark:text-white/70 text-xs text-center mt-1">
                View {images.length - 3} more
              </p>
            </button>
          )}
        </div>
        <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
      </>
    );
  }

  return null;
};

export default SearchImages;
