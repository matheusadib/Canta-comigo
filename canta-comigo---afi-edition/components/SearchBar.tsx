
import React, { useState } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome da música e o artista..."
          disabled={isLoading}
          className="w-full pl-5 pr-16 py-4 bg-gray-700/50 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:outline-none transition-all duration-300 ease-in-out shadow-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-gray-300 hover:text-teal-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <SearchIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
