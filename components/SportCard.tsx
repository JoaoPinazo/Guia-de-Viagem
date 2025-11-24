import React from 'react';
import { Sport } from '../types';
import ImageWithLoader from './ImageWithLoader';

interface SportCardProps {
  sport: Sport;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const SportCard: React.FC<SportCardProps> = ({ sport, onClick, isFavorite, onToggleFavorite }) => {
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative cursor-pointer"
    >
       <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:text-red-500 hover:bg-black/75 transition-colors duration-200"
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <div className="w-full h-48">
        <ImageWithLoader
          imageQuery={sport.imagem_query}
          altText={`Imagem de ${sport.nome}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-white mb-2">{sport.nome}</h3>
        <p className="text-gray-300 mb-4 flex-grow">{sport.descricao}</p>
        
        <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Nível: {sport.nivel}</span>
            </div>
            <div className="flex items-center text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0V7.418zM12.5 9.75v-1.698c.22.071.412.164.567.267v1.431a2.5 2.5 0 01-1.134 0z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.879.938.5.5 0 00-.22.643l.443.89.012.024c.11.223.23.44.354.653.248.426.52.82.814 1.176a4.5 4.5 0 006.592 0c.294-.356.566-.75.814-1.176.124-.213.244-.43.354-.653l.012-.024.443-.89a.5.5 0 00-.22-.643 4.5 4.5 0 00-1.879-.938V5z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{sport.preco_aula}</span>
            </div>
            <div className="flex items-start text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Local: {sport.local}</span>
            </div>
        </div>

        {sport.equipamentos && sport.equipamentos.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Equipamentos
              </h4>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                {sport.equipamentos.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SportCard;