
import React, { useRef, useEffect } from 'react';
import { ImageGridProps, ASPECT_RATIOS } from '../types';
import { ImageCard } from './ImageCard';

export const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  // Determine base width based on the ratio of the first image (assuming mostly uniform per batch)
  const firstImageRatio = images[0]?.ratio || '16:9';
  const isVertical = firstImageRatio === '9:16' || firstImageRatio === '4:5' || firstImageRatio === 'cover-9:16';
  const isSquare = firstImageRatio === '1:1';
  
  // Dynamic width class for container items
  let itemWidthClass = "w-[85vw] md:w-[600px]"; // Default 16:9
  if (isVertical) {
    itemWidthClass = "w-[85vw] md:w-[360px]";
  } else if (isSquare) {
    itemWidthClass = "w-[85vw] md:w-[500px]";
  }

  // Auto-scroll to start when images change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [images]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? window.innerWidth * 0.85 : (isVertical ? 360 : 600);
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full relative group/slider">
       {/* Gradient fade edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none hidden md:block"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none hidden md:block"></div>

      {/* Left Navigation Button */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-indigo-600/90 backdrop-blur-md text-white p-3 rounded-full border border-white/10 shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110"
        aria-label="Scroll Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Navigation Button */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-indigo-600/90 backdrop-blur-md text-white p-3 rounded-full border border-white/10 shadow-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:scale-110"
        aria-label="Scroll Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory no-scrollbar px-4 md:px-0"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((img) => (
          <div key={img.id} className={`snap-center shrink-0 ${itemWidthClass} transition-transform duration-300`}>
            <ImageCard image={img} />
          </div>
        ))}
        
        {/* Padding element to allow scrolling the last item to center */}
        <div className="w-4 shrink-0 md:hidden"></div>
      </div>
      
      <div className="flex justify-center gap-2 mt-2">
         <span className="text-xs text-gray-600 flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
           </svg>
           Swipe or use arrows to view
         </span>
      </div>
    </div>
  );
};
