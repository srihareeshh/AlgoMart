import { Product } from '../utils/productData';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isActive?: boolean;
  isSorted?: boolean;
  isFound?: boolean;
  isChecked?: boolean;
  isDimmed?: boolean;
  animationDelay?: number;
}

export function ProductCard({ 
  product, 
  isActive = false, 
  isSorted = false,
  isFound = false,
  isChecked = false,
  isDimmed = false,
  animationDelay = 0 
}: ProductCardProps) {
  const getCardStyle = () => {
    if (isFound) return 'bg-green-50 border-green-500 shadow-lg shadow-green-200 animate-pulse';
    if (isActive) return 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-200 scale-105';
    if (isSorted) return 'bg-green-50 border-green-300';
    if (isChecked) return 'bg-gray-100 border-gray-400';
    if (isDimmed) return 'bg-gray-50 border-gray-300 opacity-40';
    return 'bg-white border-gray-200';
  };

  return (
    <div
      className={`rounded-2xl border-2 p-4 transition-all duration-300 ${getCardStyle()}`}
      style={{ 
        transitionDelay: `${animationDelay}ms`,
        minWidth: '160px'
      }}
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
    </div>
  );
}
