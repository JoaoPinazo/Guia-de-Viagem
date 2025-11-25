import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o nome de uma cidade (ex: Roma)"
            className="flex-grow bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition duration-300"
            disabled={isLoading}
        />
        <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 text-gray-900 font-bold rounded-lg px-6 py-3 hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-white disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
        >
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando...
            </>
            ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Buscar
            </>
            )}
        </button>
        </form>
    </div>
  );
};

export default SearchForm;