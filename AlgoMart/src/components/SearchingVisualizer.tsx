import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RotateCcw, Home, ChevronRight, Target, Star } from 'lucide-react';
import { Navigation } from './Navigation';
import { Progress } from './ui/progress';
import { ecommerceProducts, Product } from '../utils/productData';

interface SearchingVisualizerProps {
  onNavigate: (page: string) => void;
}

interface ProductWithId extends Product {
  uniqueId: string;
}

interface SearchStep {
  array: ProductWithId[];
  currentIndex: number;
  foundIndex: number | null;
  checkedIndices: number[];
  leftBound?: number;
  rightBound?: number;
  comparisons: number;
  action: string;
}

// Helper function to generate sorted array for binary search (by name)
const generateSortedArray = (size: number): ProductWithId[] => {
  const shuffled = [...ecommerceProducts]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(size, ecommerceProducts.length))
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name alphabetically
    .map((product, index) => ({
      ...product,
      uniqueId: `product-${product.id}-${Date.now()}-${index}`
    }));
  return shuffled;
};

// Helper function to generate random array for linear search
const generateRandomArray = (size: number): ProductWithId[] => {
  const shuffled = [...ecommerceProducts]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(size, ecommerceProducts.length))
    .map((product, index) => ({
      ...product,
      uniqueId: `product-${product.id}-${Date.now()}-${index}`
    }));
  return shuffled;
};

// Helper function to check if target matches complete words in the product name
const matchesCompleteWords = (productName: string, target: string): boolean => {
  const productWords = productName.toLowerCase().split(/\s+/);
  const targetWords = target.toLowerCase().trim().split(/\s+/);
  
  // Check if all target words match complete words in the product name
  return targetWords.every(targetWord => 
    productWords.some(productWord => productWord === targetWord)
  );
};

// Linear Search Algorithm (searching by name)
const linearSearch = (arr: ProductWithId[], target: string): SearchStep[] => {
  const steps: SearchStep[] = [];
  let comparisons = 0;
  const checkedIndices: number[] = [];

  steps.push({
    array: arr,
    currentIndex: -1,
    foundIndex: null,
    checkedIndices: [],
    comparisons,
    action: `Starting linear search for product: "${target}"`
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    
    steps.push({
      array: arr,
      currentIndex: i,
      foundIndex: null,
      checkedIndices: [...checkedIndices],
      comparisons,
      action: `Checking "${arr[i].name}"`
    });

    checkedIndices.push(i);

    if (matchesCompleteWords(arr[i].name, target)) { // Complete word match
      steps.push({
        array: arr,
        currentIndex: i,
        foundIndex: i,
        checkedIndices: [...checkedIndices],
        comparisons,
        action: `Found product "${arr[i].name}" at index ${i}!`
      });
      return steps;
    }

    steps.push({
      array: arr,
      currentIndex: -1,
      foundIndex: null,
      checkedIndices: [...checkedIndices],
      comparisons,
      action: `"${arr[i].name}" does not match "${target}", continue searching`
    });
  }

  steps.push({
    array: arr,
    currentIndex: -1,
    foundIndex: null,
    checkedIndices: [...checkedIndices],
    comparisons,
    action: `Product "${target}" not found in inventory`
  });

  return steps;
};

// Binary Search Algorithm (searching by name in sorted array)
const binarySearch = (arr: ProductWithId[], target: string): SearchStep[] => {
  const steps: SearchStep[] = [];
  let comparisons = 0;
  const checkedIndices: number[] = [];
  let left = 0;
  let right = arr.length - 1;
  const targetLower = target.toLowerCase().trim();

  steps.push({
    array: arr,
    currentIndex: -1,
    foundIndex: null,
    checkedIndices: [],
    leftBound: left,
    rightBound: right,
    comparisons,
    action: `Starting binary search for product: "${target}"`
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    
    steps.push({
      array: arr,
      currentIndex: mid,
      foundIndex: null,
      checkedIndices: [...checkedIndices],
      leftBound: left,
      rightBound: right,
      comparisons,
      action: `Checking midpoint "${arr[mid].name}"`
    });

    checkedIndices.push(mid);

    if (matchesCompleteWords(arr[mid].name, target)) {
      steps.push({
        array: arr,
        currentIndex: mid,
        foundIndex: mid,
        checkedIndices: [...checkedIndices],
        leftBound: left,
        rightBound: right,
        comparisons,
        action: `Found product "${arr[mid].name}" at index ${mid}!`
      });
      return steps;
    }

    const comparison = arr[mid].name.toLowerCase().localeCompare(targetLower);
    if (comparison < 0) {
      steps.push({
        array: arr,
        currentIndex: -1,
        foundIndex: null,
        checkedIndices: [...checkedIndices],
        leftBound: mid + 1,
        rightBound: right,
        comparisons,
        action: `"${arr[mid].name}" comes before "${target}", search right half`
      });
      left = mid + 1;
    } else {
      steps.push({
        array: arr,
        currentIndex: -1,
        foundIndex: null,
        checkedIndices: [...checkedIndices],
        leftBound: left,
        rightBound: mid - 1,
        comparisons,
        action: `"${arr[mid].name}" comes after "${target}", search left half`
      });
      right = mid - 1;
    }
  }

  steps.push({
    array: arr,
    currentIndex: -1,
    foundIndex: null,
    checkedIndices: [...checkedIndices],
    leftBound: left,
    rightBound: right,
    comparisons,
    action: `Product "${target}" not found in inventory`
  });

  return steps;
};

export function SearchingVisualizer({ onNavigate }: SearchingVisualizerProps) {
  const [algorithm, setAlgorithm] = useState<'linear' | 'binary'>('linear');
  const [array, setArray] = useState<ProductWithId[]>(generateRandomArray(12));
  const [arraySize, setArraySize] = useState(12);
  const [targetValue, setTargetValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [speed, setSpeed] = useState(50);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isSearching && currentStep < steps.length - 1) {
      const delay = 101 - speed;
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsSearching(false);
            if (timeRef.current) clearInterval(timeRef.current);
          }
          return next;
        });
      }, delay);

      if (!timeRef.current) {
        setStartTime(Date.now());
        timeRef.current = window.setInterval(() => {
          setElapsedTime(Date.now() - startTime);
        }, 10);
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSearching, currentStep, steps.length, speed, startTime]);

  const handleSearch = () => {
    const target = targetValue.trim();
    if (!target) return;

    let searchSteps: SearchStep[] = [];
    
    if (algorithm === 'linear') {
      searchSteps = linearSearch(array, target);
    } else {
      searchSteps = binarySearch(array, target);
    }
    
    setSteps(searchSteps);
    setCurrentStep(0);
    setElapsedTime(0);
    setIsSearching(true);
  };

  const handleReset = () => {
    setIsSearching(false);
    setCurrentStep(0);
    setSteps([]);
    setTargetValue('');
    setElapsedTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  const handleGenerateNewArray = () => {
    const newArray = algorithm === 'binary' 
      ? generateSortedArray(arraySize) 
      : generateRandomArray(arraySize);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsSearching(false);
    setTargetValue('');
    setElapsedTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  const handleAlgorithmChange = (newAlgorithm: 'linear' | 'binary') => {
    setAlgorithm(newAlgorithm);
    const newArray = newAlgorithm === 'binary' 
      ? generateSortedArray(arraySize) 
      : generateRandomArray(arraySize);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setTargetValue('');
  };

  const currentStepData = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  const getCardState = (index: number) => {
    if (!currentStepData) return 'default';
    
    if (currentStepData.foundIndex === index) return 'found';
    if (currentStepData.currentIndex === index) return 'checking';
    if (currentStepData.checkedIndices.includes(index)) return 'checked';
    
    // For binary search, fade out elements outside bounds
    if (algorithm === 'binary' && currentStepData.leftBound !== undefined && currentStepData.rightBound !== undefined) {
      if (index < currentStepData.leftBound || index > currentStepData.rightBound) {
        return 'outOfRange';
      }
    }
    
    return 'default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation currentPage="searching" onNavigate={onNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-green-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">Searching Visualizer</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8" />
            <h1 className="text-white">Product Search Visualizer</h1>
          </div>
          <p className="text-white/90">Find products by name using Linear and Binary Search algorithms with visual animations</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            {/* Algorithm Selection */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => handleAlgorithmChange(e.target.value as 'linear' | 'binary')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isSearching}
              >
                <option value="linear">Linear Search</option>
                <option value="binary">Binary Search</option>
              </select>
            </div>

            {/* Target Value */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Product Name</label>
              <input
                type="text"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., Laptop"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isSearching}
              />
            </div>

            {/* Array Size */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Products: {arraySize}</label>
              <input
                type="range"
                min="6"
                max="20"
                value={arraySize}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  setArraySize(size);
                  if (steps.length === 0) {
                    const newArray = algorithm === 'binary' 
                      ? generateSortedArray(size) 
                      : generateRandomArray(size);
                    setArray(newArray);
                  }
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isSearching || steps.length > 0}
              />
            </div>

            {/* Speed Control */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Speed: {speed}%</label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* Generate New Array */}
            <div className="flex items-end">
              <button
                onClick={handleGenerateNewArray}
                className="w-full px-4 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSearching}
              >
                New Array
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSearch}
              disabled={isSearching || !targetValue}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
              Search
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>

            {steps.length > 0 && (
              <div className="ml-auto text-sm text-slate-600">
                Step <span className="text-green-600">{currentStep + 1}</span> of {steps.length}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {steps.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Progress</span>
                <span className="text-slate-900">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <motion.div 
                layout
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(arraySize <= 8 ? 4 : arraySize <= 12 ? 4 : arraySize <= 16 ? 5 : 5, arraySize)}, minmax(0, 1fr))`
                }}
              >
                <AnimatePresence mode="popLayout">
                  {array.map((product, index) => {
                    const state = getCardState(index);
                    
                    let cardClass = 'bg-white border-slate-200';
                    let shadowClass = '';
                    let scaleValue = 1;
                    let zIndex = 1;
                    let opacity = 1;
                    
                    if (state === 'found') {
                      cardClass = 'bg-green-50 border-green-500';
                      shadowClass = 'shadow-2xl shadow-green-400/70';
                      scaleValue = 1.12;
                      zIndex = 30;
                    } else if (state === 'checking') {
                      cardClass = 'bg-yellow-50 border-yellow-500';
                      shadowClass = 'shadow-xl shadow-yellow-400/60';
                      scaleValue = 1.08;
                      zIndex = 20;
                    } else if (state === 'checked') {
                      cardClass = 'bg-slate-100 border-slate-400';
                      shadowClass = 'shadow-md shadow-slate-300/40';
                    } else if (state === 'outOfRange') {
                      cardClass = 'bg-slate-50 border-slate-200';
                      opacity = 0.3;
                    }
                    
                    return (
                      <motion.div
                        key={product.uniqueId}
                        layoutId={product.uniqueId}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: opacity,
                          scale: scaleValue,
                          zIndex: zIndex
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          layout: { 
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                            duration: 0.6
                          },
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                          zIndex: { duration: 0 }
                        }}
                        style={{ zIndex }}
                        className={`rounded-xl border-2 p-4 transition-colors duration-300 ${cardClass} ${shadowClass}`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-full aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center w-full">
                            <div className="text-xs text-slate-900 line-clamp-2 min-h-[2rem]">
                              {product.name}
                            </div>
                            <div className="text-green-600 mt-1.5">
                              ₹{product.price.toFixed(0)}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-slate-600">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Action Description */}
            {currentStepData && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-xl p-4 border ${
                  currentStepData.foundIndex !== null
                    ? 'bg-green-50 border-green-200'
                    : currentStep === steps.length - 1
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <p className={`text-sm ${
                  currentStepData.foundIndex !== null
                    ? 'text-green-900'
                    : currentStep === steps.length - 1
                    ? 'text-red-900'
                    : 'text-blue-900'
                }`}>
                  {currentStepData.action}
                </p>
              </motion.div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-slate-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-xs text-blue-700 mb-1">Comparisons</div>
                  <motion.div
                    className="text-3xl text-blue-600"
                    key={currentStepData?.comparisons || 0}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {currentStepData?.comparisons || 0}
                  </motion.div>
                </div>

                <div className={`rounded-xl p-4 ${
                  currentStepData?.foundIndex !== null
                    ? 'bg-gradient-to-br from-green-50 to-green-100'
                    : steps.length > 0 && currentStep === steps.length - 1
                    ? 'bg-gradient-to-br from-red-50 to-red-100'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100'
                }`}>
                  <div className={`text-xs mb-1 ${
                    currentStepData?.foundIndex !== null
                      ? 'text-green-700'
                      : steps.length > 0 && currentStep === steps.length - 1
                      ? 'text-red-700'
                      : 'text-slate-700'
                  }`}>Status</div>
                  <div className={`text-lg ${
                    currentStepData?.foundIndex !== null
                      ? 'text-green-700'
                      : steps.length > 0 && currentStep === steps.length - 1
                      ? 'text-red-700'
                      : 'text-slate-700'
                  }`}>
                    {currentStepData?.foundIndex !== null
                      ? '✓ Found'
                      : steps.length > 0 && currentStep === steps.length - 1
                      ? '✗ Not Found'
                      : 'Searching...'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-xs text-purple-700 mb-1">Time Elapsed</div>
                  <div className="text-3xl text-purple-600">
                    {(elapsedTime / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-emerald-200">
              <h3 className="text-slate-900 mb-2">
                {algorithm === 'linear' ? 'Linear Search' : 'Binary Search'}
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                {algorithm === 'linear'
                  ? 'Checks each element sequentially from start to finish.'
                  : 'Divides the search space in half each time. Requires sorted data.'}
              </p>
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Complexity:</span>
                  <span className="font-mono text-emerald-600 bg-emerald-200/50 px-2 py-0.5 rounded">
                    {algorithm === 'linear' ? 'O(n)' : 'O(log n)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-slate-900 mb-4">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border-2 border-slate-200 bg-white" />
                  <span className="text-slate-700">Not Checked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border-2 border-yellow-500 bg-yellow-50" />
                  <span className="text-slate-700">Checking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border-2 border-slate-400 bg-slate-100" />
                  <span className="text-slate-700">Checked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border-2 border-green-500 bg-green-50" />
                  <span className="text-slate-700">Found</span>
                </div>
                {algorithm === 'binary' && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-slate-200 bg-slate-50 opacity-30" />
                    <span className="text-slate-700">Out of Range</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
