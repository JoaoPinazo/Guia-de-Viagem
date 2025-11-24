import React, { useEffect, useState } from 'react';
import { GuideItem, ItemType, Tour, Restaurant, Party, Camping, Trail, Sport } from '../types';
import ImageWithLoader from './ImageWithLoader';

interface DetailsModalProps {
  selectedItem: { item: GuideItem, itemType: ItemType } | null;
  onClose: () => void;
  onImageClick: (imageUrl: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            {halfStar && (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const getAddress = (item: GuideItem, itemType: ItemType): string => {
    switch (itemType) {
      case 'trail':
        return (item as Trail).ponto_partida;
      case 'sport':
        return (item as Sport).local;
      default:
        return (item as Tour | Restaurant | Party | Camping).endereco;
    }
}

const DetailsModal: React.FC<DetailsModalProps> = ({ selectedItem, onClose, onImageClick }) => {
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!selectedItem) {
        return null;
    }

    const { item, itemType } = selectedItem;
    const address = getAddress(item, itemType);
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    
    const renderDetails = () => {
        switch(itemType) {
            case 'tour': {
                const tour = item as Tour;
                return (
                    <div className='space-y-4'>
                        <div className="flex items-center text-blue-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg><span className="font-medium">{tour.horario_funcionamento}</span></div>
                        <div className="flex items-center text-blue-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0V7.418zM12.5 9.75v-1.698c.22.071.412.164.567.267v1.431a2.5 2.5 0 01-1.134 0z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.879.938.5.5 0 00-.22.643l.443.89.012.024c.11.223.23.44.354.653.248.426.52.82.814 1.176a4.5 4.5 0 006.592 0c.294-.356.566-.75.814-1.176.124-.213.244-.43.354-.653l.012-.024.443-.89a.5.5 0 00-.22-.643 4.5 4.5 0 00-1.879-.938V5z" clipRule="evenodd" /></svg><span className="font-medium">{tour.preco_ingresso}</span></div>
                        <ul className="space-y-2 text-gray-300 list-disc list-inside pl-2"><h4 className="font-semibold text-white -ml-2 mb-1">Destaques:</h4>{tour.destaques.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                    </div>
                )
            }
            // Add other cases here...
            default:
                return null;
        }
    }

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl m-4 transform animate-fade-in-scale flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-3xl font-bold text-white">{item.nome}</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Fechar modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
                <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-700">
                    <ImageWithLoader
                        imageQuery={item.imagem_query}
                        altText={`Imagem de ${item.nome}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onLoad={setGeneratedImageUrl}
                        onClick={() => {
                            if (generatedImageUrl) {
                                onImageClick(generatedImageUrl);
                            }
                        }}
                    />
                </div>

                <p className="text-gray-300 text-lg">{item.descricao}</p>

                {renderDetails()}
                
                <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-2xl font-semibold text-white mb-4">Localização</h3>
                    <p className="text-blue-300 mb-4">{address}</p>
                    <iframe className="w-full h-80 rounded-lg border border-gray-700" loading="lazy" allowFullScreen src={mapSrc}></iframe>
                </div>
                
                {item.avaliacoes && item.avaliacoes.length > 0 && (
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-2xl font-semibold text-white mb-4">Avaliações de Usuários</h3>
                        <div className="space-y-4">
                            {item.avaliacoes.map((review, index) => (
                                <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-bold text-blue-300">{review.autor}</p>
                                        <StarRating rating={review.nota} />
                                    </div>
                                    <p className="text-gray-300 italic">"{review.comentario}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
    );
};

export default DetailsModal;
