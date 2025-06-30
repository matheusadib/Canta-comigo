
import React, { useRef, useCallback } from 'react';
import { LyricsData } from '../types';

interface LyricsDisplayProps {
  data: LyricsData;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ data }) => {
  const originalRef = useRef<HTMLDivElement>(null);
  const translationRef = useRef<HTMLDivElement>(null);
  const ipaRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const handleScroll = useCallback((scrolledFrom: 'original' | 'translation' | 'ipa') => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    
    let scrollTop = 0;
    if (scrolledFrom === 'original' && originalRef.current) scrollTop = originalRef.current.scrollTop;
    if (scrolledFrom === 'translation' && translationRef.current) scrollTop = translationRef.current.scrollTop;
    if (scrolledFrom === 'ipa' && ipaRef.current) scrollTop = ipaRef.current.scrollTop;

    if (scrolledFrom !== 'original' && originalRef.current) originalRef.current.scrollTop = scrollTop;
    if (scrolledFrom !== 'translation' && translationRef.current) translationRef.current.scrollTop = scrollTop;
    if (scrolledFrom !== 'ipa' && ipaRef.current) ipaRef.current.scrollTop = scrollTop;

    requestAnimationFrame(() => {
        isSyncing.current = false;
    });
  }, []);

  const Column = ({ title, content, contentRef, onScroll, fontClass = '' }: { title: string, content: React.ReactNode[], contentRef: React.RefObject<HTMLDivElement>, onScroll: () => void, fontClass?: string }) => (
    <div className="bg-gray-800/50 rounded-lg shadow-lg flex flex-col h-full backdrop-blur-sm border border-gray-700">
      <h2 className="text-lg font-bold text-teal-300 p-4 border-b border-gray-700 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-10">
        {title}
      </h2>
      <div
        ref={contentRef}
        onScroll={onScroll}
        className="p-4 space-y-3 overflow-y-auto flex-grow h-[calc(100vh-28rem)] md:h-auto"
      >
        {content.map((line, index) => (
          <p key={index} className={`leading-relaxed ${fontClass}`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 p-4 animate-fade-in">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">{data.title}</h1>
            <p className="text-xl text-gray-400">{data.artist}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-20rem)] md:h-[60vh]">
            <Column 
                title={data.language}
                content={data.lyrics.map(l => l.original)}
                contentRef={originalRef}
                onScroll={() => handleScroll('original')}
            />
            <Column 
                title="Tradução (Português-BR)"
                content={data.lyrics.map(l => l.translation)}
                contentRef={translationRef}
                onScroll={() => handleScroll('translation')}
            />
            <Column 
                title="Pronúncia (AFI)"
                content={data.lyrics.map(l => l.ipa)}
                contentRef={ipaRef}
                onScroll={() => handleScroll('ipa')}
                fontClass="font-roboto-mono text-gray-300"
            />
        </div>
    </div>
  );
};

export default LyricsDisplay;
