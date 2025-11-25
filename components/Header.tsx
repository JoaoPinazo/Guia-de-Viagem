import React from 'react';

interface HeaderProps {
  onRegisterClick: () => void;
  onFavoritesClick: () => void;
  favoritesCount: number;
}

const Header: React.FC<HeaderProps> = ({ onRegisterClick, onFavoritesClick, favoritesCount }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
             <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold tracking-tight text-yellow-500">
                    Guia de Viagens
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                    Descubra os melhores passeios, restaurantes e festas.
                </p>
            </div>
            <div className="flex items-center gap-3">
                 <button
                    onClick={onFavoritesClick}
                    className="flex items-center gap-2 bg-gray-700 text-white font-bold rounded-lg px-4 py-2 text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Favoritos</span>
                    <span className="bg-blue-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">{favoritesCount}</span>
                </button>
                <button
                    onClick={onRegisterClick}
                    className="bg-yellow-500 text-gray-900 font-bold rounded-lg px-4 py-2 text-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 transition duration-300"
                >
                    Cadastre-se
                </button>
            </div>
        </div>
    </header>
  );
};

export default Header;