import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface NavigationProps {
  currentPage?: string;
  onNavigate: (page: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onSearchChange?: (query: string) => void;
  isEcommerce?: boolean;
}

export function Navigation({ 
  currentPage, 
  onNavigate, 
  cartItemCount = 0,
  onCartClick,
  onSearchChange,
  isEcommerce = false
}: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Sorting Visualizer', page: 'sorting' },
    { label: 'Searching Visualizer', page: 'searching' },
    { label: 'Compare Algorithms', page: 'compare' },
    { label: 'About', page: 'about' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-30" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }}>
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg text-[#111827] hidden sm:block group-hover:text-[#6366F1] transition-colors duration-300" style={{ fontWeight: 600 }}>AlgoMart</span>
          </button>

          {/* Search Bar - Desktop */}
          {isEcommerce && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent focus:bg-white transition-all duration-300 text-[#111827] placeholder:text-[#6B7280]"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`text-sm transition-colors duration-300 relative group ${
                  currentPage === link.page
                    ? 'text-[#2563EB]'
                    : 'text-[#6B7280] hover:text-[#2563EB]'
                }`}
                style={{ fontWeight: currentPage === link.page ? 600 : 400 }}
              >
                {link.label}
                {currentPage === link.page && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-[1.3rem] left-0 right-0 h-0.5 bg-[#2563EB]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            {isEcommerce && (
              <motion.button
                onClick={onCartClick}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F9FAFB] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5 text-[#111827]" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center"
                    style={{ 
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(99,102,241,0.3)'
                    }}
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F9FAFB] transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#111827]" />
              ) : (
                <Menu className="w-5 h-5 text-[#111827]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isEcommerce && (
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent focus:bg-white transition-all duration-300 text-[#111827] placeholder:text-[#6B7280]"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="lg:hidden border-t border-gray-100 bg-white"
        >
          <div className="px-4 py-3 space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentPage === link.page
                    ? 'bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 text-[#6366F1]'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                }`}
                style={{ fontWeight: currentPage === link.page ? 600 : 400 }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
