import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white text-black rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold z-10 hover:bg-gray-200 transition"
          aria-label="Fechar imagem"
        >
          &times;
        </button>
        <img 
          src={imageUrl} 
          alt="Visualização ampliada" 
          className="rounded-lg object-contain max-w-full max-h-[85vh]"
        />
      </div>
    </div>
  );
};

export default ImageModal;
