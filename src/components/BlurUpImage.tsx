import React, { useState } from 'react';

interface BlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const BlurUpImage: React.FC<BlurUpImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#161614] ${containerClassName}`}>
      {/* Low-res ambient placeholder glow/shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#161614] via-[#242420] to-[#161614] animate-pulse">
          <div className="absolute inset-0 backdrop-blur-xl" />
        </div>
      )}

      {/* Main Image with Progressive Blur-Up Effect */}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded
            ? 'filter blur-0 scale-100 opacity-100'
            : 'filter blur-xl scale-105 opacity-60'
        } ${className}`}
      />
    </div>
  );
};
