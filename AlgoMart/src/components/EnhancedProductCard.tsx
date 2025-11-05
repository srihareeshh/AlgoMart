import { Product } from '../utils/productData';
import { Star, Package } from 'lucide-react';
import { useState } from 'react';

interface EnhancedProductCardProps {
  product: Product;
  isActive?: boolean;
  isSorted?: boolean;
  isComparing?: boolean;
  isSwapping?: boolean;
  animationDelay?: number;
  viewMode?: 'card' | 'bar';
  maxPrice?: number;
}

export function EnhancedProductCard({ 
  product, 
  isActive = false, 
  isSorted = false,
  isComparing = false,
  isSwapping = false,
  animationDelay = 0,
  viewMode = 'card',
  maxPrice = 300
}: EnhancedProductCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getCardStyle = () => {
    if (isSorted) return 'bg-green-50 border-green-500 shadow-lg shadow-green-200/50';
    if (isSwapping) return 'bg-orange-50 border-orange-500 shadow-xl shadow-orange-300/60 -translate-y-3';
    if (isComparing) return 'bg-yellow-50 border-yellow-500 shadow-lg shadow-yellow-300/60';
    if (isActive) return 'bg-blue-50 border-blue-400 shadow-md';
    return 'bg-white border-gray-200';
  };

  if (viewMode === 'bar') {
    const barHeight = (product.price / maxPrice) * 200;
    return (
      <div className="relative flex flex-col items-center gap-2 group">
        <div
          className={`w-12 rounded-t-lg transition-all duration-500 ${
            isSorted ? 'bg-green-500' :
            isSwapping ? 'bg-orange-500' :
            isComparing ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
          style={{ 
            height: `${barHeight}px`,
            transitionDelay: `${animationDelay}ms`
          }}
        />
        <div className="text-xs text-gray-600">{product.image}</div>
        <div className="text-xs text-gray-900">₹{product.price}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`rounded-2xl border-2 p-4 transition-all duration-500 cursor-pointer ${getCardStyle()}`}
        style={{ 
          transitionDelay: `${animationDelay}ms`,
          minWidth: '160px',
          transform: isSwapping ? 'translateY(-12px) scale(1.05)' : isComparing ? 'translateY(-6px)' : 'translateY(0)'
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl">{product.image}</div>
          <div className="text-center">
            <div className="text-sm text-gray-900 line-clamp-2">{product.name}</div>
            <div className="text-blue-600 mt-1">₹{product.price.toFixed(0)}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Glow effect for comparing */}
        {isComparing && (
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-pulse pointer-events-none" />
        )}

        {/* Glow effect for swapping */}
        {isSwapping && (
          <div className="absolute inset-0 rounded-2xl border-2 border-orange-400 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-3 h-3" />
              <span>{product.name}</span>
            </div>
            <div className="space-y-1 text-gray-300">
              <div>Price: ₹{product.price.toFixed(0)}</div>
              <div>Rating: {product.rating} ⭐</div>
              <div>Category: {product.category}</div>
              <div>ID: #{product.id}</div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
