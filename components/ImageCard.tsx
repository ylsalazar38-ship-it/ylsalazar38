
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  
  const handleDownload = () => {
    if (!image.url || image.isLoading || image.error) return;

    const link = document.createElement('a');
    link.href = image.url;
    link.download = `models-generator-${image.ratio || 'image'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Define CSS aspect ratio class based on the requested ratio
  // Note: The actual image returned by API might differ slightly (e.g. 4:5 returns 3:4), 
  // but we display the container in the target ratio or fit the image content.
  // API returns: 1:1, 3:4, 4:3, 9:16, 16:9.
  
  const getAspectRatioClass = (ratioId?: string) => {
     switch(ratioId) {
        case '1:1': return 'aspect-square';
        case '4:5': return 'aspect-[4/5]'; // Custom arbitrary ratio support in Tailwind
        case '9:16': return 'aspect-[9/16]';
        case 'cover-9:16': return 'aspect-[9/16]';
        case '1.91:1': return 'aspect-[1.91/1]';
        case '1584x396': return 'aspect-[4/1]';
        case '1128x191': return 'aspect-[5.9/1]';
        default: return 'aspect-video'; // 16:9
     }
  };

  const aspectRatioClass = getAspectRatioClass(image.ratio);

  if (image.isLoading) {
    return (
      <div className={`${aspectRatioClass} w-full rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden relative group animate-pulse`}>
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gray-500 font-medium">Dreaming...</span>
        </div>
      </div>
    );
  }

  if (image.error) {
     return (
      <div className={`${aspectRatioClass} w-full rounded-2xl bg-gray-900/50 border border-red-900/30 overflow-hidden relative flex items-center justify-center`}>
        <div className="text-center p-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          <p className="text-gray-400 text-sm">Could not generate image.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative ${aspectRatioClass} w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl transition-transform duration-300 hover:-translate-y-1`}>
      {/* Image */}
      <img 
        src={image.url} 
        alt={image.prompt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-center">
             <span className="text-xs font-medium text-gray-300 bg-black/30 backdrop-blur-md px-2 py-1 rounded uppercase">
               {image.ratio || '16:9'}
             </span>
             
             <button 
                onClick={handleDownload}
                className="bg-white text-black hover:bg-indigo-50 font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
               Download
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
