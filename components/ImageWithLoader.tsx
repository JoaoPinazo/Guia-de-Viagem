import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';

interface Props {
  imageQuery: string;
  altText: string;
  className?: string;
  onClick?: () => void;
  onLoad?: (url: string) => void;
}

const ImageWithLoader: React.FC<Props> = ({ imageQuery, altText, className, onClick, onLoad }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadImage = async () => {
            if (!imageQuery) return;
            setError(false);
            try {
                const base64Image = await generateImage(imageQuery);
                if (isMounted) {
                    const fullUrl = `data:image/jpeg;base64,${base64Image}`;
                    setImageUrl(fullUrl);
                    onLoad?.(fullUrl);
                }
            } catch (err) {
                console.error(`Failed to generate image for query: "${imageQuery}"`, err);
                if (isMounted) {
                    setError(true);
                }
            }
        };
        
        loadImage();
        
        return () => { isMounted = false; };
    }, [imageQuery, onLoad]);

    if (error) {
         return (
            <div className={`w-full h-full bg-gray-700 flex flex-col items-center justify-center text-center text-red-300 p-2 ${className?.replace('object-cover', '')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs mt-2">Erro ao gerar imagem</span>
            </div>
        );
    }

    if (!imageUrl) {
        return (
            <div className={`w-full h-full bg-gray-700 animate-pulse flex items-center justify-center ${className?.replace('object-cover', '')}`}>
                <svg className="w-10 h-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
        );
    }

    return (
        <img 
          src={imageUrl} 
          alt={altText} 
          className={className}
          onClick={onClick}
        />
    );
};

export default ImageWithLoader;
