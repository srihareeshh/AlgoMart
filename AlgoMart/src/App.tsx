import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { SortingVisualizer } from './components/SortingVisualizer';
import { SearchingVisualizer } from './components/SearchingVisualizer';
import { CompareAlgorithms } from './components/CompareAlgorithms';
import { AboutPage } from './components/AboutPage';

type Page = 'home' | 'sorting' | 'searching' | 'compare' | 'about';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'sorting':
        return <SortingVisualizer onNavigate={setCurrentPage} />;
      case 'searching':
        return <SearchingVisualizer onNavigate={setCurrentPage} />;
      case 'compare':
        return <CompareAlgorithms onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}
