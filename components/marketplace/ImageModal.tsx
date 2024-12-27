'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  images: string[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ images, activeIndex, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        break;
      case 'ArrowRight':
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        break;
    }
  }, [isOpen, images.length, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const x = e.pageX - startX;
    const walk = x - scrollLeft;
    
    if (Math.abs(walk) > 100) {
      if (walk > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setIsDragging(false);
      } else if (walk < 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/60 hover:text-white/90 transition-colors bg-black/50 rounded-lg"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 z-50 p-3 text-white/60 hover:text-white/90 transition-colors bg-black/50 rounded-lg"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 z-50 p-3 text-white/60 hover:text-white/90 transition-colors bg-black/50 rounded-lg"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Main Image */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-8 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={images[currentIndex]}
          alt={`View ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageModal;
