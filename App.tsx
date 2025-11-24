

import React, { useState, useEffect } from 'react';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import TourCard from './components/TourCard';
import RestaurantCard from './components/RestaurantCard';
import PartyCard from './components/PartyCard';
import CampingCard from './components/CampingCard';
import TrailCard from './components/TrailCard';
import SportCard from './components/SportCard';
import LoadingSpinner from './components/LoadingSpinner';
import ImageModal from './components/ImageModal';
import DetailsModal from './components/DetailsModal';
import { fetchTours, fetchRestaurants, fetchParties, fetchCampings, fetchTrails, fetchSports } from './services/geminiService';
import { Tour, Restaurant, Party, Camping, Trail, Sport, FavoriteItem, GuideItem, ItemType } from './types';
import Header from './components/Header';
import RegisterModal from './components/RegisterModal';
import FavoritesModal from './components/FavoritesModal';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-blue-400 mb-6 pb-2 border-b-2 border-gray-700">{title}</h2>
      {children}
    </section>
  );
}

const App: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [campings, setCampings] = useState<Camping[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ item: GuideItem, itemType: ItemType } | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('city-guide-favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      localStorage.removeItem('city-guide-favorites');
    }
  }, []);

  const handleToggleFavorite = (item: GuideItem, itemType: ItemType) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.nome === item.nome && fav.itemType === itemType);
      let newFavorites;
      if (isFavorited) {
        newFavorites = prevFavorites.filter(fav => !(fav.nome === item.nome && fav.itemType === itemType));
      } else {
        newFavorites = [...prevFavorites, { ...item, itemType }];
      }
      localStorage.setItem('city-guide-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isItemFavorite = (item: GuideItem, itemType: ItemType) => {
    return favorites.some(fav => fav.nome === item.nome && fav.itemType === itemType);
  };

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const handleCardClick = (item: GuideItem, itemType: ItemType) => {
    setSelectedItem({ item, itemType });
  };

  const handleRegisterOpen = () => setIsRegisterModalOpen(true);
  const handleRegisterClose = () => setIsRegisterModalOpen(false);
  const handleFavoritesOpen = () => setIsFavoritesModalOpen(true);
  const handleFavoritesClose = () => setIsFavoritesModalOpen(false);


  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setTours([]);
    setRestaurants([]);
    setParties([]);
    setCampings([]);
    setTrails([]);
    setSports([]);

    try {
        const [
            tourResults, 
            restaurantResults, 
            partyResults,
            campingResults,
            trailResults,
            sportResults
        ] = await Promise.all([
            fetchTours(query),
            fetchRestaurants(query),
            fetchParties(query),
            fetchCampings(query),
            fetchTrails(query),
            fetchSports(query)
        ]);

        setTours(tourResults);
        setRestaurants(restaurantResults);
        setParties(partyResults);
        setCampings(campingResults);
        setTrails(trailResults);
        setSports(sportResults);
        
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado ao buscar sugestões.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="text-center my-10 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg max-w-2xl mx-auto">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      );
    }
    
    if (!hasSearched) {
         return (
             <div className="text-center my-10 p-8 bg-gray-800/50 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-white mb-2">Bem-vindo ao Guia de Viagens!</h2>
                <p className="text-gray-300">Digite o nome de uma cidade e descubra lugares incríveis recomendados pela nossa inteligência artificial.</p>
            </div>
         );
    }

    if(hasSearched && !isLoading && tours.length === 0 && restaurants.length === 0 && parties.length === 0 && campings.length === 0 && trails.length === 0 && sports.length === 0){
        return (
             <div className="text-center my-10 p-8 bg-gray-800/50 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-white mb-2">Nenhum resultado encontrado</h2>
                <p className="text-gray-300">Tente buscar por outra cidade ou verifique se o nome está correto.</p>
            </div>
        )
    }

    return (
        <div className="mt-10">
            {tours.length > 0 ? (
                <Section title="Passeios Imperdíveis">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tours.map((tour, index) => (
                            <TourCard key={`tour-${tour.nome}-${index}`} tour={tour} onClick={() => handleCardClick(tour, 'tour')} isFavorite={isItemFavorite(tour, 'tour')} onToggleFavorite={() => handleToggleFavorite(tour, 'tour')} />
                        ))}
                    </div>
                </Section>
            ) : null}

            {restaurants.length > 0 ? (
                <Section title="Onde Comer">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {restaurants.map((restaurant, index) => (
                            <RestaurantCard key={`restaurant-${restaurant.nome}-${index}`} restaurant={restaurant} onClick={() => handleCardClick(restaurant, 'restaurant')} isFavorite={isItemFavorite(restaurant, 'restaurant')} onToggleFavorite={() => handleToggleFavorite(restaurant, 'restaurant')} />
                        ))}
                    </div>
                </Section>
            ) : null}
            
            {parties.length > 0 ? (
                <Section title="Festas e Eventos da Semana">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {parties.map((party, index) => (
                            <PartyCard key={`party-${party.nome}-${index}`} party={party} onClick={() => handleCardClick(party, 'party')} isFavorite={isItemFavorite(party, 'party')} onToggleFavorite={() => handleToggleFavorite(party, 'party')} />
                        ))}
                    </div>
                </Section>
            ) : null}

            {trails.length > 0 ? (
                <Section title="Trilhas e Caminhadas">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trails.map((trail, index) => (
                            <TrailCard key={`trail-${trail.nome}-${index}`} trail={trail} onClick={() => handleCardClick(trail, 'trail')} isFavorite={isItemFavorite(trail, 'trail')} onToggleFavorite={() => handleToggleFavorite(trail, 'trail')} />
                        ))}
                    </div>
                </Section>
            ) : null}

            {campings.length > 0 ? (
                <Section title="Acampamentos">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {campings.map((camping, index) => (
                            <CampingCard key={`camping-${camping.nome}-${index}`} camping={camping} onClick={() => handleCardClick(camping, 'camping')} isFavorite={isItemFavorite(camping, 'camping')} onToggleFavorite={() => handleToggleFavorite(camping, 'camping')} />
                        ))}
                    </div>
                </Section>
            ) : null}

            {sports.length > 0 ? (
                <Section title="Esportes e Aventura">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sports.map((sport, index) => (
                            <SportCard key={`sport-${sport.nome}-${index}`} sport={sport} onClick={() => handleCardClick(sport, 'sport')} isFavorite={isItemFavorite(sport, 'sport')} onToggleFavorite={() => handleToggleFavorite(sport, 'sport')} />
                        ))}
                    </div>
                </Section>
            ) : null}
        </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header 
        onRegisterClick={handleRegisterOpen}
        onFavoritesClick={handleFavoritesOpen}
        favoritesCount={favorites.length}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading}
        />
        {renderContent()}
      </main>
      <Footer />
      {modalImage && <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={handleRegisterClose} />
      <FavoritesModal 
        isOpen={isFavoritesModalOpen} 
        onClose={handleFavoritesClose}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onCardClick={handleCardClick}
      />
      <DetailsModal 
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onImageClick={handleImageClick}
      />
    </div>
  );
};

export default App;