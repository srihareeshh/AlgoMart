import { useState, useMemo } from 'react';
import { BarChart3, Search as SearchIcon, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ecommerceProducts, Product } from '../utils/productData';
import { CartSidebar, CartItem } from './CartSidebar';
import { Navigation } from './Navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

type SortOption = 'price-low' | 'price-high' | 'rating' | 'name';
type AlgorithmType = 'bubble' | 'selection' | 'heap' | 'merge' | 'linear' | 'binary';

export function HomePage({ onNavigate }: HomePageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [algorithmType, setAlgorithmType] = useState<'sorting' | 'searching'>('sorting');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bubble');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Sort and filter products
  const displayedProducts = useMemo(() => {
    let filtered = ecommerceProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleSortChange = (value: SortOption) => {
    setIsAnimating(true);
    setSortBy(value);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Navigation */}
      <Navigation
        currentPage="home"
        onNavigate={onNavigate}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        isEcommerce={true}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl p-8 sm:p-10 mb-6 text-white relative overflow-hidden"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider opacity-90">Learn DSA by Shopping</span>
            </div>
            <h1 className="mb-3 text-white leading-tight" style={{ fontWeight: 600 }}>
              Experience Algorithms in Action
            </h1>
            <p className="text-base text-white/90 max-w-2xl leading-relaxed">
              Watch sorting and searching algorithms work in real-time as you browse products.
              Choose an algorithm below to see how it organizes your shopping experience!
            </p>
          </div>
        </motion.div>

        {/* Algorithm Controls & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Algorithm Mode Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.3 } }}
            className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[rgba(99,102,241,0.1)]"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <h3 className="text-[#111827] mb-3 flex items-center gap-2" style={{ fontWeight: 600 }}>
              <BarChart3 className="w-5 h-5 text-[#6366F1]" />
              Algorithm Mode
            </h3>
            
            <RadioGroup
              value={algorithmType}
              onValueChange={(value: 'sorting' | 'searching') => setAlgorithmType(value)}
              className="mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sorting" id="sorting" />
                <Label htmlFor="sorting" className="cursor-pointer">Sorting Algorithms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="searching" id="searching" />
                <Label htmlFor="searching" className="cursor-pointer">Searching Algorithms</Label>
              </div>
            </RadioGroup>

            <Select
              value={selectedAlgorithm}
              onValueChange={(value: AlgorithmType) => setSelectedAlgorithm(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {algorithmType === 'sorting' ? (
                  <>
                    <SelectItem value="bubble">Bubble Sort</SelectItem>
                    <SelectItem value="selection">Selection Sort</SelectItem>
                    <SelectItem value="heap">Heap Sort</SelectItem>
                    <SelectItem value="merge">Merge Sort</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="linear">Linear Search</SelectItem>
                    <SelectItem value="binary">Binary Search</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Sort Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.3 } }}
            className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[rgba(99,102,241,0.1)]"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <h3 className="text-[#111827] mb-3" style={{ fontWeight: 600 }}>Sort Products By</h3>
            <RadioGroup value={sortBy} onValueChange={handleSortChange}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low" id="price-low" />
                  <Label htmlFor="price-low" className="cursor-pointer">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high" id="price-high" />
                  <Label htmlFor="price-high" className="cursor-pointer">Price: High to Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rating" id="rating" />
                  <Label htmlFor="rating" className="cursor-pointer">Top Rated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id="name" />
                  <Label htmlFor="name" className="cursor-pointer">Alphabetical</Label>
                </div>
              </div>
            </RadioGroup>
          </motion.div>
        </div>

        {/* Visualizer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <motion.button
            onClick={() => onNavigate('sorting')}
            className="group relative overflow-hidden text-white rounded-xl p-5"
            style={{
              background: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            whileHover={{ 
              y: -3, 
              boxShadow: '0 4px 16px rgba(99,102,241,0.2)',
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            }}
            whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-white mb-0.5" style={{ fontWeight: 600 }}>Visualize Sorting</h3>
                <p className="text-sm text-white/85">See {selectedAlgorithm} sort in action</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => onNavigate('searching')}
            className="group relative overflow-hidden text-white rounded-xl p-5"
            style={{
              background: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            whileHover={{ 
              y: -3, 
              boxShadow: '0 4px 16px rgba(99,102,241,0.2)',
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            }}
            whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <SearchIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-white mb-0.5" style={{ fontWeight: 600 }}>Visualize Searching</h3>
                <p className="text-sm text-white/85">Watch search algorithms find products</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Products Grid */}
        <div className="mb-4">
          <h2 className="text-[#111827] mb-1.5" style={{ fontWeight: 600 }}>
            Products ({displayedProducts.length})
          </h2>
          <p className="text-sm text-[#6B7280]">
            Sorted by: <span className="text-[#6366F1]" style={{ fontWeight: 500 }}>
              {sortBy === 'price-low' && 'Price (Low to High)'}
              {sortBy === 'price-high' && 'Price (High to Low)'}
              {sortBy === 'rating' && 'Top Rated'}
              {sortBy === 'name' && 'Alphabetical'}
            </span>
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                whileHover={{ 
                  y: -4,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                className="group bg-white rounded-2xl overflow-hidden border border-[rgba(99,102,241,0.08)]"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>{product.rating}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-xs text-[#6B7280] mb-1 uppercase tracking-wide">{product.category}</p>
                  <h3 className="text-sm text-[#111827] mb-2 line-clamp-2" style={{ fontWeight: 500 }}>{product.name}</h3>
                  <p className="text-[#111827] mb-3" style={{ fontWeight: 600 }}>₹{product.price.toFixed(0)}</p>
                  
                  <motion.button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2.5 text-white rounded-xl flex items-center justify-center gap-2 transition-colors duration-300"
                    style={{ 
                      background: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
                      fontWeight: 500
                    }}
                    whileHover={{ 
                      boxShadow: '0 2px 12px rgba(99,102,241,0.25)',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.97, transition: { duration: 0.15 } }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add to Cart</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {displayedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-10 h-10 text-[#6B7280]" />
            </div>
            <h3 className="text-[#111827] mb-2" style={{ fontWeight: 600 }}>No products found</h3>
            <p className="text-sm text-[#6B7280]">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
