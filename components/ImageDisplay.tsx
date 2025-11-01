import React from 'react';

interface ImageDisplayProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
}

const ImageCard: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode }> = ({ title, imageUrl, children }) => (
  <div className="w-full">
    <h3 className="text-xl font-bold mb-3 text-center text-gray-300">{title}</h3>
    <div className="aspect-w-1 aspect-h-1 bg-gray-800/50 rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, editedImage, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <ImageCard title="Original" imageUrl={originalImage}>
        <p className="text-gray-500">Upload an image to start</p>
      </ImageCard>
      
      <ImageCard title="Enhanced" imageUrl={editedImage}>
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-gray-400">
            <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-semibold">Gemini is thinking...</p>
          </div>
        ) : (
          <p className="text-gray-500 p-4 text-center">Your enhanced image will appear here.</p>
        )}
      </ImageCard>
    </div>
  );
};
