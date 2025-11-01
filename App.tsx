import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { SparklesIcon, LoadingSpinnerIcon } from './components/IconComponents';
import { editImageWithGemini } from './services/geminiService';
import { PhotoState } from './types';
import { DEFAULT_PROMPT, DEFAULT_IMAGE_DATA_URL } from './constants';

const App: React.FC = () => {
  const [photoState, setPhotoState] = useState<PhotoState>({
    original: {
      dataUrl: DEFAULT_IMAGE_DATA_URL,
      mimeType: 'image/jpeg',
    },
    edited: null,
  });
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoState({
        original: {
          dataUrl: reader.result as string,
          mimeType: file.type,
        },
        edited: null, // Reset edited image on new upload
      });
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read the file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleEnhanceClick = useCallback(async () => {
    if (!photoState.original || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPhotoState(prevState => ({ ...prevState, edited: null }));

    try {
      const { dataUrl, mimeType } = photoState.original;
      // Strip the prefix from the data URL
      const base64Data = dataUrl.split(',')[1];
      
      const editedBase64 = await editImageWithGemini(base64Data, mimeType, prompt);
      
      setPhotoState(prevState => ({
        ...prevState,
        edited: `data:image/jpeg;base64,${editedBase64}`,
      }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [photoState.original, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Photo Enhancer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Edit your images with the power of Gemini.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-gray-800/50 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Upload Photo</h2>
            <ImageUploader onImageUpload={handleImageUpload} />

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Describe Edit</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter, make the background blurry..."
              className="w-full h-36 p-3 bg-gray-900/70 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none text-gray-300"
            />

            <button
              onClick={handleEnhanceClick}
              disabled={isLoading || !photoState.original || !prompt}
              className="w-full mt-6 py-3 px-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
            >
              {isLoading ? (
                <>
                  <LoadingSpinnerIcon />
                  Enhancing...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Enhance Image
                </>
              )}
            </button>
            {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </div>

          <div className="lg:col-span-8">
             <ImageDisplay originalImage={photoState.original?.dataUrl} editedImage={photoState.edited} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 mt-8">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
