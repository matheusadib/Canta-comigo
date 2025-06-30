
import React, { useState, useCallback, useEffect } from 'react';
import { LyricsData } from './types';
import { getLyricsAnalysis } from './services/geminiService';
import SearchBar from './components/SearchBar';
import LyricsDisplay from './components/LyricsDisplay';
import { MusicIcon } from './components/icons';

const App: React.FC = () => {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-gray-900 text-gray-100 antialiased';
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setIsInitial(false);
    setLyricsData(null);
    try {
      const data = await getLyricsAnalysis(query);
      if (data && 'error' in data) {
         setError((data as any).error);
      } else {
        setLyricsData(data);
      }
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-400 mt-20">
          <div className="w-12 h-12 border-4 border-t-transparent border-teal-400 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Analisando a música...</p>
          <p className="text-sm">Isso pode levar alguns segundos.</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center mt-20 p-6 bg-red-900/20 border border-red-500 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-red-400">Oops! Algo deu errado.</h3>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      );
    }

    if (lyricsData) {
      return <LyricsDisplay data={lyricsData} />;
    }

    if (isInitial) {
        return (
            <div className="text-center mt-20 text-gray-500">
                <MusicIcon className="w-24 h-24 mx-auto text-gray-700"/>
                <h2 className="mt-4 text-2xl font-semibold">Bem-vindo ao Canta Comigo</h2>
                <p className="mt-2 max-w-lg mx-auto">
                    Digite uma música e artista para ver a letra original, tradução e pronúncia fonética lado a lado.
                </p>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-teal-900/30">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400 mb-2">
            Canta Comigo
          </h1>
          <p className="text-lg text-gray-400">AFI Edition</p>
        </header>
        <div className="sticky top-8 z-20">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>Powered by Gemini API. Feito com ❤️ para amantes de música.</p>
      </footer>
    </div>
  );
};

export default App;
