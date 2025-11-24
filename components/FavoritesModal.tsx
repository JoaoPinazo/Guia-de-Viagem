import React, { useEffect } from 'react';
import { FavoriteItem, GuideItem, ItemType, Tour, Restaurant, Party, Camping, Trail, Sport } from '../types';
import TourCard from './TourCard';
import RestaurantCard from './RestaurantCard';
import PartyCard from './PartyCard';
import CampingCard from './CampingCard';
import TrailCard from './TrailCard';
import SportCard from './SportCard';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (item: GuideItem, itemType: ItemType) => void;
  onCardClick: (item: GuideItem, itemType: ItemType) => void;
}

const renderFavoriteCard = (
    item: FavoriteItem, 
    onToggleFavorite: (item: GuideItem, itemType: ItemType) => void, 
    onCardClick: (item: GuideItem, itemType: ItemType) => void
) => {
    const isFavorite = true; // It's always a favorite inside this modal
    const toggleFavorite = () => onToggleFavorite(item, item.itemType);
    const cardClick = () => onCardClick(item, item.itemType);

    switch (item.itemType) {
        case 'tour':
            return <TourCard tour={item as Tour} onClick={cardClick} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
        case 'restaurant':
            return <RestaurantCard restaurant={item as Restaurant} onClick={cardClick} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
        case 'party':
            return <PartyCard party={item as Party} onClick={cardClick} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
        case 'camping':
            return <CampingCard camping={item as Camping} onClick={cardClick} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
        case 'trail':
            return <TrailCard trail={item as Trail} onClick={cardClick} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
        case 'sport':
            return <SportCard sport={item as Sport} onClick={cardClick} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />;
        default:
            return null;
    }
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose, favorites, onToggleFavorite, onCardClick }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-4xl m-4 transform animate-fade-in-scale flex flex-col"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">Meus Favoritos</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Fechar modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
            <div className="overflow-y-auto max-h-[75vh] pr-2 -mr-2">
                 {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {favorites.map((item) => (
                            <div key={`${item.itemType}-${item.nome}`}>
                                {renderFavoriteCard(item, onToggleFavorite, onCardClick)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-white">Sua lista de favoritos está vazia</h3>
                        <p className="mt-1 text-sm text-gray-400">Clique no coração de um item para salvá-lo aqui.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
    );
};

export default FavoritesModal;