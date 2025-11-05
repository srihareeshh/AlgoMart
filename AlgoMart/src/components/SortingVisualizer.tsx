import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronRight, Home, Package, BarChart3, LayoutGrid, Code2 } from 'lucide-react';
import { Navigation } from './Navigation';
import { Progress } from './ui/progress';
import { ecommerceProducts, Product } from '../utils/productData';
import { Star } from 'lucide-react';

interface SortingVisualizerProps {
  onNavigate: (page: string) => void;
}

interface ProductWithId extends Product {
  uniqueId: string;
}

interface SortStep {
  array: ProductWithId[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  comparisons: number;
  swaps: number;
  action: string;
}

// Pseudocode definitions for each algorithm
const algorithmPseudocode = {
  bubble: [
    'function bubbleSort(arr):',
    '  for i = 0 to n-1:',
    '    for j = 0 to n-i-2:',
    '      if arr[j] > arr[j+1]:',
    '        swap(arr[j], arr[j+1])',
    '  return arr'
  ],
  selection: [
    'function selectionSort(arr):',
    '  for i = 0 to n-1:',
    '    minIndex = i',
    '    for j = i+1 to n-1:',
    '      if arr[j] < arr[minIndex]:',
    '        minIndex = j',
    '    swap(arr[i], arr[minIndex])',
    '  return arr'
  ],
  insertion: [
    'function insertionSort(arr):',
    '  for i = 1 to n-1:',
    '    key = arr[i]',
    '    j = i - 1',
    '    while j >= 0 and arr[j] > key:',
    '      arr[j+1] = arr[j]',
    '      j = j - 1',
    '    arr[j+1] = key',
    '  return arr'
  ],
  merge: [
    'function mergeSort(arr):',
    '  if length <= 1:',
    '    return arr',
    '  mid = length / 2',
    '  left = mergeSort(arr[0...mid])',
    '  right = mergeSort(arr[mid...n])',
    '  return merge(left, right)',
    '',
    'function merge(left, right):',
    '  result = []',
    '  while left and right not empty:',
    '    if left[0] <= right[0]:',
    '      result.add(left[0])',
    '    else:',
    '      result.add(right[0])',
    '  return result'
  ]
};

// Helper function to shuffle and prepare products
// Counter for truly unique IDs
let idCounter = 0;

const generateProductArray = (size: number): ProductWithId[] => {
  const timestamp = Date.now();
  const shuffled = [...ecommerceProducts]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(size, ecommerceProducts.length))
    .map((product, index) => ({
      ...product,
      uniqueId: `product-${product.id}-${timestamp}-${index}-${idCounter++}`
    }));
  return shuffled;
};

// Bubble Sort Algorithm
const bubbleSort = (arr: ProductWithId[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  steps.push({
    array: array.map(e => ({ ...e })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [...sortedIndices],
    comparisons,
    swaps,
    action: 'Initial state - Ready to sort by price'
  });

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      
      // Comparing - Highlight both elements being compared
      steps.push({
        array: array.map(e => ({ ...e })),
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        action: `Comparing ₹${array[j].price.toFixed(0)} and ₹${array[j + 1].price.toFixed(0)}`
      });

      if (array[j].price > array[j + 1].price) {
        // Swapping - Animate the cross-over
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        
        steps.push({
          array: array.map(e => ({ ...e })),
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          comparisons,
          swaps,
          action: `Swapping: ₹${array[j].price.toFixed(0)} ← → ₹${array[j + 1].price.toFixed(0)}`
        });
      }
    }
    sortedIndices.push(array.length - i - 1);
  }

  steps.push({
    array: array.map(e => ({ ...e })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    comparisons,
    swaps,
    action: 'Sorting complete! All products sorted by price.'
  });

  return steps;
};

// Merge Sort Algorithm
const mergeSort = (arr: ProductWithId[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: array.map(e => ({ ...e })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    comparisons,
    swaps,
    action: 'Initial state - Starting Merge Sort'
  });

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = array.slice(left, mid + 1).map(e => ({ ...e }));
    const rightArr = array.slice(mid + 1, right + 1).map(e => ({ ...e }));
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      
      steps.push({
        array: array.map(e => ({ ...e })),
        comparingIndices: [left + i, mid + 1 + j],
        swappingIndices: [],
        sortedIndices: [],
        comparisons,
        swaps,
        action: `Comparing ₹${leftArr[i].price.toFixed(0)} and ₹${rightArr[j].price.toFixed(0)}`
      });

      if (leftArr[i].price <= rightArr[j].price) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      swaps++;
      
      steps.push({
        array: array.map(e => ({ ...e })),
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [],
        comparisons,
        swaps,
        action: `Merged element at position ${k}`
      });
      
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      swaps++;
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      swaps++;
      j++;
      k++;
    }
  };

  const mergeSortHelper = (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  };

  mergeSortHelper(0, array.length - 1);

  steps.push({
    array: array.map(e => ({ ...e })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    comparisons,
    swaps,
    action: 'Sorting complete!'
  });

  return steps;
};

// Insertion Sort Algorithm
const insertionSort = (arr: ProductWithId[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [0];

  steps.push({
    array: array.map(e => ({ ...e })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [0],
    comparisons,
    swaps,
    action: 'Initial state - Starting Insertion Sort'
  });

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      array: array.map(e => ({ ...e })),
      comparingIndices: [i],
      swappingIndices: [],
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      action: `Inserting ₹${key.price.toFixed(0)}`
    });

    while (j >= 0 && array[j].price > key.price) {
      comparisons++;
      
      steps.push({
        array: array.map(e => ({ ...e })),
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        action: `Comparing ₹${array[j].price.toFixed(0)} and ₹${key.price.toFixed(0)}`
      });

      array[j + 1] = array[j];
      swaps++;
      
      steps.push({
        array: array.map(e => ({ ...e })),
        comparingIndices: [],
        swappingIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        comparisons,
        swaps,
        action: `Shifting ₹${array[j].price.toFixed(0)}`
      });
      
      j--;
    }

    array[j + 1] = key;
    sortedIndices.push(i);
    
    steps.push({
      array: array.map(e => ({ ...e })),
      comparingIndices: [],
      swappingIndices: [j + 1],
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      action: `Placed ₹${key.price.toFixed(0)} at position ${j + 1}`
    });
  }

  steps.push({
    array: array.map(e => ({ ...e })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    comparisons,
    swaps,
    action: 'Sorting complete!'
  });

  return steps;
};

export function SortingVisualizer({ onNavigate }: SortingVisualizerProps) {
  const [array, setArray] = useState<ProductWithId[]>(generateProductArray(12));
  const [arraySize, setArraySize] = useState(12);
  const [algorithm, setAlgorithm] = useState<'bubble' | 'merge' | 'insertion' | 'selection'>('bubble');
  const [viewMode, setViewMode] = useState<'cards' | 'bars'>('cards');
  const [barViewMode, setBarViewMode] = useState<'icon' | 'barOnly'>('icon'); // Icon view vs Bar-only view
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [speed, setSpeed] = useState(50);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [merges, setMerges] = useState(0); // Track merge operations
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentAction, setCurrentAction] = useState('Ready to start');
  const [splitPositions, setSplitPositions] = useState<Map<string, number>>(new Map());
  const [mergingGroups, setMergingGroups] = useState<string[][]>([]);
  const [activeGroups, setActiveGroups] = useState<[number, number] | null>(null);
  const [verticalOffsets, setVerticalOffsets] = useState<Map<number, number>>(new Map()); // Track vertical positions for merge sort
  const [mergedIndices, setMergedIndices] = useState<number[]>([]); // Track merged elements
  const [keyIndex, setKeyIndex] = useState(-1);
  const [minIndex, setMinIndex] = useState(-1);
  const intervalRef = useRef<number | null>(null);
  const timeRef = useRef<number | null>(null);
  const stopSortingRef = useRef(false);

  // Function to get current executing line based on action
  const getCurrentCodeLine = (): number => {
    const action = currentAction.toLowerCase();
    
    switch (algorithm) {
      case 'bubble':
        if (action.includes('initial') || action.includes('ready')) return 0;
        if (action.includes('comparing')) return 3;
        if (action.includes('swapping')) return 4;
        if (action.includes('complete')) return 5;
        return 2;
      
      case 'selection':
        if (action.includes('initial') || action.includes('ready')) return 0;
        if (action.includes('finding')) return 4;
        if (action.includes('comparing')) return 4;
        if (action.includes('swapping') || action.includes('placing')) return 6;
        if (action.includes('complete')) return 7;
        return 2;
      
      case 'insertion':
        if (action.includes('initial') || action.includes('ready')) return 0;
        if (action.includes('key')) return 2;
        if (action.includes('shifting') || action.includes('comparing')) return 5;
        if (action.includes('inserting') || action.includes('placing')) return 7;
        if (action.includes('complete')) return 8;
        return 1;
      
      case 'merge':
        if (action.includes('initial') || action.includes('ready')) return 0;
        if (action.includes('splitting') || action.includes('dividing')) return 4;
        if (action.includes('comparing')) return 11;
        if (action.includes('merging')) return 12;
        if (action.includes('complete')) return 15;
        return 6;
      
      default:
        return 0;
    }
  };

  useEffect(() => {
    // Only use step-based approach for non-async algorithms
    const useStepBased = algorithm !== 'bubble' && algorithm !== 'merge' && algorithm !== 'insertion' && algorithm !== 'selection';
    if (useStepBased && isPlaying && currentStep < steps.length - 1) {
      const delay = 101 - speed; // Inverse for intuitive slider
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
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
  }, [isPlaying, currentStep, steps.length, speed, startTime, algorithm]);

  useEffect(() => {
    const useStepBased = algorithm !== 'bubble' && algorithm !== 'merge' && algorithm !== 'insertion' && algorithm !== 'selection';
    if (useStepBased && steps[currentStep]) {
      setArray(steps[currentStep].array);
    }
  }, [currentStep, steps, algorithm]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSortAnimation = async () => {
    let arr = [...array];
    const n = arr.length;
    let comparisonCount = 0;
    let swapCount = 0;
    const sorted: number[] = [];
    
    stopSortingRef.current = false;
    setIsPlaying(true);
    
    // Start timer
    const startTimeMs = Date.now();
    setStartTime(startTimeMs);
    const timeInterval = window.setInterval(() => {
      setElapsedTime(Date.now() - startTimeMs);
    }, 10);

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopSortingRef.current) {
          clearInterval(timeInterval);
          return;
        }

        // Highlight the two adjacent elements being compared
        setHighlightIndices([j, j + 1]);
        setSwappingIndices([]);
        comparisonCount++;
        setComparisons(comparisonCount);
        setCurrentAction(`Comparing ₹${arr[j].price.toFixed(0)} and ₹${arr[j + 1].price.toFixed(0)}`);
        
        const delay = Math.max(50, 1100 - speed * 10); // Speed-based delay
        await sleep(delay);

        if (stopSortingRef.current) {
          clearInterval(timeInterval);
          return;
        }

        if (arr[j].price > arr[j + 1].price) {
          // Show swapping state
          setSwappingIndices([j, j + 1]);
          setHighlightIndices([]);
          swapCount++;
          setSwaps(swapCount);
          setCurrentAction(`Swapping: ₹${arr[j].price.toFixed(0)} ↔ ₹${arr[j + 1].price.toFixed(0)}`);
          
          // Perform the swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          
          await sleep(delay * 1.2);
        }
      }
      
      // Mark the last element of this pass as sorted
      sorted.push(n - i - 1);
      setSortedIndices([...sorted]);
    }

    // Mark all as sorted
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setHighlightIndices([]);
    setSwappingIndices([]);
    setCurrentAction('Sorting complete! All products sorted by price.');
    setIsPlaying(false);
    clearInterval(timeInterval);
  };

  const mergeSortAnimation = async () => {
    stopSortingRef.current = false;
    setIsPlaying(true);
    
    let comparisonCount = 0;
    let mergeCount = 0;
    
    // Start timer
    const startTimeMs = Date.now();
    setStartTime(startTimeMs);
    const timeInterval = window.setInterval(() => {
      setElapsedTime(Date.now() - startTimeMs);
    }, 10);

    const delay = Math.max(400, 1200 - speed * 10);

    // Track vertical offsets for visualization
    const verticalMap = new Map<number, number>();

    // Recursive merge sort with divide-and-conquer visualization
    const mergeSort = async (arr: ProductWithId[], leftIdx: number, rightIdx: number, depth: number = 0): Promise<void> => {
      if (leftIdx >= rightIdx) return;
      if (stopSortingRef.current) return;

      const mid = Math.floor((leftIdx + rightIdx) / 2);

      // DIVIDE PHASE - Move elements down to show recursion levels
      const verticalOffset = depth * 35; // 35px per level
      for (let i = leftIdx; i <= rightIdx; i++) {
        verticalMap.set(i, verticalOffset);
      }
      setVerticalOffsets(new Map(verticalMap));
      setActiveGroups([leftIdx, rightIdx]);
      setCurrentAction(`Dividing: elements ${leftIdx} to ${rightIdx} (depth ${depth})`);
      await sleep(delay * 0.7);

      // Recursively sort both halves
      await mergeSort(arr, leftIdx, mid, depth + 1);
      await mergeSort(arr, mid + 1, rightIdx, depth + 1);

      if (stopSortingRef.current) return;

      // MERGE PHASE
      await merge(arr, leftIdx, mid, rightIdx, depth);

      // Move merged elements back up
      for (let i = leftIdx; i <= rightIdx; i++) {
        verticalMap.set(i, Math.max(0, (depth - 1) * 35));
      }
      setVerticalOffsets(new Map(verticalMap));

      // Clear active range after merge at root level
      if (depth === 0) {
        setActiveGroups(null);
        setVerticalOffsets(new Map());
      }
    };

    const merge = async (arr: ProductWithId[], left: number, mid: number, right: number, depth: number): Promise<void> => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0, j = 0, k = left;
      const merged: number[] = [];

      setCurrentAction(`Merging: left [${left}-${mid}] with right [${mid + 1}-${right}]`);
      await sleep(delay * 0.5);

      while (i < leftArr.length && j < rightArr.length) {
        if (stopSortingRef.current) break;

        // Highlight comparison - yellow color
        setHighlightIndices([left + i, mid + 1 + j]);
        comparisonCount++;
        setComparisons(comparisonCount);
        setCurrentAction(`Comparing ₹${leftArr[i].price.toFixed(0)} and ₹${rightArr[j].price.toFixed(0)}`);
        await sleep(delay);

        if (leftArr[i].price <= rightArr[j].price) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }

        merged.push(k);
        setMergedIndices([...merged]);
        setArray([...arr]);
        mergeCount++;
        setMerges(mergeCount);
        k++;
        await sleep(delay * 0.6);
      }

      // Add remaining elements from left array
      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        merged.push(k);
        setMergedIndices([...merged]);
        i++;
        k++;
        setArray([...arr]);
        mergeCount++;
        setMerges(mergeCount);
        await sleep(delay * 0.4);
      }

      // Add remaining elements from right array
      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        merged.push(k);
        setMergedIndices([...merged]);
        j++;
        k++;
        setArray([...arr]);
        mergeCount++;
        setMerges(mergeCount);
        await sleep(delay * 0.4);
      }

      setHighlightIndices([]);
      setCurrentAction(`Merged range [${left}-${right}]`);
      await sleep(delay * 0.5);
      setMergedIndices([]);
    };

    const arrCopy = [...array];
    await mergeSort(arrCopy, 0, arrCopy.length - 1, 0);
    
    if (!stopSortingRef.current) {
      setArray(arrCopy);
      setSortedIndices(Array.from({ length: arrCopy.length }, (_, i) => i));
      setCurrentAction('Merge sort complete! All products sorted by price.');
    }
    
    setHighlightIndices([]);
    setMergedIndices([]);
    setActiveGroups(null);
    setVerticalOffsets(new Map());
    setIsPlaying(false);
    clearInterval(timeInterval);
  };

  const insertionSortAnimation = async () => {
    stopSortingRef.current = false;
    setIsPlaying(true);
    
    let comparisonCount = 0;
    let swapCount = 0;
    
    // Start timer
    const startTimeMs = Date.now();
    setStartTime(startTimeMs);
    const timeInterval = window.setInterval(() => {
      setElapsedTime(Date.now() - startTimeMs);
    }, 10);

    const delay = Math.max(300, 1100 - speed * 10);
    let arr = [...array];

    // First element is already "sorted"
    setSortedIndices([0]);
    await sleep(delay * 0.5);

    for (let i = 1; i < arr.length; i++) {
      if (stopSortingRef.current) {
        clearInterval(timeInterval);
        return;
      }

      const key = arr[i];
      const keyStartIndex = i;
      setKeyIndex(i);
      setHighlightIndices([i]);
      setSwappingIndices([]);
      setCurrentAction(`Selecting element at index ${i}: ₹${key.price.toFixed(0)} as key`);
      await sleep(delay);

      let j = i - 1;
      let insertPosition = i;

      // Shift elements greater than key to the right
      while (j >= 0 && arr[j].price > key.price) {
        if (stopSortingRef.current) {
          clearInterval(timeInterval);
          return;
        }

        // Highlight comparison
        setHighlightIndices([keyStartIndex]);
        setSwappingIndices([j, j + 1]);
        comparisonCount++;
        setComparisons(comparisonCount);
        setCurrentAction(`Comparing ₹${arr[j].price.toFixed(2)} > ₹${key.price.toFixed(2)}, shifting right`);
        
        // Shift element - swap instead of duplicate
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        insertPosition = j;
        swapCount++;
        setSwaps(swapCount);
        
        // Update key index as it moves
        if (keyStartIndex === j + 1) {
          setKeyIndex(j);
        }
        
        setArray([...arr]);
        await sleep(delay);

        j--;
      }

      if (j >= 0) {
        // Final comparison where we don't shift
        setHighlightIndices([insertPosition]);
        setSwappingIndices([j]);
        comparisonCount++;
        setComparisons(comparisonCount);
        setCurrentAction(`Comparing ₹${arr[j].price.toFixed(2)} ≤ ₹${key.price.toFixed(2)}, found position`);
        await sleep(delay * 0.7);
      }

      // Key is now in correct position
      setKeyIndex(-1);
      setHighlightIndices([]);
      setSwappingIndices([]);
      
      // Update sorted region
      setSortedIndices(Array.from({ length: i + 1 }, (_, idx) => idx));
      setCurrentAction(`Element ₹${key.price.toFixed(2)} is now at position ${insertPosition}. Sorted up to index ${i}.`);
      await sleep(delay * 0.8);
    }

    // Mark all as sorted
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setKeyIndex(-1);
    setHighlightIndices([]);
    setSwappingIndices([]);
    setCurrentAction('Insertion sort complete! All products sorted by price.');
    setIsPlaying(false);
    clearInterval(timeInterval);
  };

  const selectionSortAnimation = async () => {
    stopSortingRef.current = false;
    setIsPlaying(true);
    
    let comparisonCount = 0;
    let swapCount = 0;
    
    // Start timer
    const startTimeMs = Date.now();
    setStartTime(startTimeMs);
    const timeInterval = window.setInterval(() => {
      setElapsedTime(Date.now() - startTimeMs);
    }, 10);

    const delay = Math.max(300, 1100 - speed * 10);
    let arr = [...array];

    for (let i = 0; i < arr.length - 1; i++) {
      if (stopSortingRef.current) {
        clearInterval(timeInterval);
        return;
      }

      let minIdx = i;

      // Highlight the initial minimum
      setMinIndex(minIdx);
      setHighlightIndices([]);
      setSwappingIndices([]);
      setSortedIndices(Array.from({ length: i }, (_, idx) => idx));
      setCurrentAction(`Searching for minimum from position ${i}. Current minimum at index ${minIdx}.`);
      await sleep(delay);

      // Find the minimum element
      for (let j = i + 1; j < arr.length; j++) {
        if (stopSortingRef.current) {
          clearInterval(timeInterval);
          return;
        }

        // Highlight comparing element
        setMinIndex(minIdx);
        setHighlightIndices([j]);
        setSwappingIndices([]);
        comparisonCount++;
        setComparisons(comparisonCount);
        setCurrentAction(`Comparing ₹${arr[j].price.toFixed(2)} with current minimum ₹${arr[minIdx].price.toFixed(2)}`);
        await sleep(delay * 0.6);

        if (arr[j].price < arr[minIdx].price) {
          // New minimum found
          const oldMinIdx = minIdx;
          minIdx = j;
          
          setMinIndex(minIdx);
          setHighlightIndices([oldMinIdx]);
          setCurrentAction(`New minimum found! ₹${arr[minIdx].price.toFixed(2)} at index ${minIdx}`);
          await sleep(delay * 0.5);
        }
      }

      // Swap the minimum element with the first unsorted element
      if (minIdx !== i) {
        setMinIndex(-1);
        setHighlightIndices([]);
        setSwappingIndices([i, minIdx]);
        swapCount++;
        setSwaps(swapCount);
        setCurrentAction(`Swapping: ₹${arr[i].price.toFixed(2)} ↔ ₹${arr[minIdx].price.toFixed(2)}`);
        
        // Perform the swap
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        
        await sleep(delay * 1.2);
      }

      // Mark element as sorted
      setMinIndex(-1);
      setHighlightIndices([]);
      setSwappingIndices([]);
      setSortedIndices(Array.from({ length: i + 1 }, (_, idx) => idx));
      await sleep(delay * 0.3);
    }

    // Mark all as sorted
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setMinIndex(-1);
    setHighlightIndices([]);
    setSwappingIndices([]);
    setCurrentAction('Selection sort complete! All products sorted by price.');
    setIsPlaying(false);
    clearInterval(timeInterval);
  };

  const handleStart = () => {
    if (algorithm === 'bubble') {
      // Use async animation for bubble sort
      setComparisons(0);
      setSwaps(0);
      setSortedIndices([]);
      setHighlightIndices([]);
      setSwappingIndices([]);
      setSplitPositions(new Map());
      setKeyIndex(-1);
      setMinIndex(-1);
      setElapsedTime(0);
      bubbleSortAnimation();
    } else if (algorithm === 'merge') {
      // Use async animation for merge sort
      setComparisons(0);
      setSwaps(0);
      setMerges(0);
      setSortedIndices([]);
      setHighlightIndices([]);
      setSwappingIndices([]);
      setSplitPositions(new Map());
      setActiveGroups(null);
      setVerticalOffsets(new Map());
      setMergedIndices([]);
      setKeyIndex(-1);
      setMinIndex(-1);
      setElapsedTime(0);
      mergeSortAnimation();
    } else if (algorithm === 'insertion') {
      // Use async animation for insertion sort
      setComparisons(0);
      setSwaps(0);
      setSortedIndices([]);
      setHighlightIndices([]);
      setSwappingIndices([]);
      setSplitPositions(new Map());
      setKeyIndex(-1);
      setMinIndex(-1);
      setElapsedTime(0);
      insertionSortAnimation();
    } else if (algorithm === 'selection') {
      // Use async animation for selection sort
      setComparisons(0);
      setSwaps(0);
      setSortedIndices([]);
      setHighlightIndices([]);
      setSwappingIndices([]);
      setSplitPositions(new Map());
      setKeyIndex(-1);
      setMinIndex(-1);
      setElapsedTime(0);
      selectionSortAnimation();
    } else {
      // Use step-based approach for other algorithms
      if (steps.length === 0) {
        // No step-based algorithms remaining
        setSteps([]);
        setCurrentStep(0);
        setElapsedTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    stopSortingRef.current = true;
    setIsPlaying(false);
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  const handleReset = () => {
    stopSortingRef.current = true;
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setArray(generateProductArray(arraySize));
    setElapsedTime(0);
    setComparisons(0);
    setSwaps(0);
    setMerges(0);
    setHighlightIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setSplitPositions(new Map());
    setActiveGroups(null);
    setVerticalOffsets(new Map());
    setMergedIndices([]);
    setKeyIndex(-1);
    setMinIndex(-1);
    setCurrentAction('Ready to start');
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  const handleGenerateNewArray = () => {
    stopSortingRef.current = true;
    setArray(generateProductArray(arraySize));
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setElapsedTime(0);
    setComparisons(0);
    setSwaps(0);
    setMerges(0);
    setHighlightIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setSplitPositions(new Map());
    setActiveGroups(null);
    setVerticalOffsets(new Map());
    setMergedIndices([]);
    setKeyIndex(-1);
    setMinIndex(-1);
    setCurrentAction('Ready to start');
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  const currentStepData = steps[currentStep];
  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  const getCardState = (index: number) => {
    const isAsyncAlgorithm = algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection';
    
    if (isAsyncAlgorithm) {
      // Use real-time state for async algorithms
      if (index === keyIndex) return 'key'; // Special state for insertion sort key
      if (index === minIndex) return 'minimum'; // Special state for selection sort minimum
      if (sortedIndices.includes(index) && keyIndex === -1 && minIndex === -1) return 'sorted';
      if (sortedIndices.includes(index) && (algorithm === 'insertion' || algorithm === 'selection')) return 'sorted-partial';
      if (swappingIndices.includes(index)) return 'swapping';
      if (highlightIndices.includes(index)) return 'comparing';
      return 'default';
    } else {
      // Use step-based state for other algorithms
      if (!currentStepData) return 'default';
      
      if (currentStepData.sortedIndices.includes(index)) return 'sorted';
      if (currentStepData.pivotIndex === index) return 'pivot';
      if (currentStepData.swappingIndices.includes(index)) return 'swapping';
      if (currentStepData.comparingIndices.includes(index)) return 'comparing';
      
      return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navigation currentPage="sorting" onNavigate={onNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-5">
          <button onClick={() => onNavigate('home')} className="hover:text-[#2563EB] transition-colors duration-300 flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#111827]" style={{ fontWeight: 500 }}>Sorting Visualizer</span>
        </div>

        {/* Header */}
        <div className="rounded-2xl p-8 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 16px rgba(99,102,241,0.15)' }}>
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-7 h-7" />
            <h1 className="text-white" style={{ fontWeight: 600 }}>Product Sorting Visualizer</h1>
          </div>
          <p className="text-white/90">Watch products get sorted by price using different sorting algorithms</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl p-5 border border-[rgba(99,102,241,0.1)] mb-6" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
            {/* Algorithm Selection */}
            <div>
              <label className="block text-sm text-[#6B7280] mb-2" style={{ fontWeight: 500 }}>Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all duration-300"
                disabled={isPlaying || steps.length > 0}
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="merge">Merge Sort</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm text-[#6B7280] mb-2" style={{ fontWeight: 500 }}>View Mode</label>
              <button
                onClick={() => setViewMode(viewMode === 'cards' ? 'bars' : 'cards')}
                className="w-full px-4 py-2.5 text-white rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
                  fontWeight: 500
                }}
                disabled={isPlaying}
              >
                {viewMode === 'cards' ? (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Bar View
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-4 h-4" />
                    Card View
                  </>
                )}
              </button>
            </div>

            {/* Bar View Mode Toggle (only visible in bar view) */}
            {viewMode === 'bars' && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">Bar Display</label>
                <button
                  onClick={() => setBarViewMode(barViewMode === 'icon' ? 'barOnly' : 'icon')}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isPlaying}
                >
                  {barViewMode === 'icon' ? (
                    <>
                      <Package className="w-4 h-4" />
                      Icon View
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      Bar Only
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Array Size */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Items: {arraySize}</label>
              <input
                type="range"
                min="6"
                max="20"
                value={arraySize}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  setArraySize(size);
                  if (steps.length === 0) {
                    setArray(generateProductArray(size));
                  }
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isPlaying || steps.length > 0}
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Generate New Array */}
            <div className="flex items-end">
              <button
                onClick={handleGenerateNewArray}
                className="w-full px-4 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPlaying}
              >
                Shuffle
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {((algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? !isPlaying && sortedIndices.length === 0 : steps.length === 0) ? (
              <button
                onClick={handleStart}
                disabled={isPlaying}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_16px_rgba(99,102,241,0.25)]"
                style={{ 
                  background: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.15)'
                }}
              >
                <Play className="w-5 h-5" />
                Start Sorting
              </button>
            ) : (
              <button
                onClick={isPlaying ? handlePause : handleStart}
                disabled={(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') && sortedIndices.length === array.length}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_16px_rgba(99,102,241,0.25)]"
                style={{ 
                  background: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.15)'
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? 'Start Sorting' : 'Resume'}
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-[#6B7280] text-white rounded-xl hover:bg-[#111827] transition-all duration-300"
              style={{ fontWeight: 500, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>

            {algorithm !== 'bubble' && algorithm !== 'merge' && algorithm !== 'insertion' && algorithm !== 'selection' && steps.length > 0 && (
              <div className="ml-auto text-sm text-[#6B7280]">
                Step <span className="text-[#6366F1]" style={{ fontWeight: 600 }}>{currentStep + 1}</span> of {steps.length}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {algorithm !== 'bubble' && algorithm !== 'merge' && algorithm !== 'insertion' && algorithm !== 'selection' && steps.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]" style={{ fontWeight: 500 }}>Progress</span>
                <span className="text-[#111827]" style={{ fontWeight: 600 }}>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              {viewMode === 'cards' ? (
                // Card View
                <div 
                  className="grid gap-4 w-full max-w-[1200px] mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(arraySize <= 8 ? 4 : arraySize <= 12 ? 4 : arraySize <= 16 ? 5 : 5, arraySize)}, minmax(0, 1fr))`
                  }}
                >
                  {array.map((product, index) => {
                      const state = getCardState(index);
                      const splitOffset = splitPositions.get(product.uniqueId) || 0;
                      
                      // Check if this card is part of an active group being divided (for merge sort)
                      const isInActiveGroup = activeGroups && index >= activeGroups[0] && index <= activeGroups[1];
                      
                      let cardClass = 'bg-white border-slate-200';
                      let shadowClass = '';
                      let scaleValue = 1;
                      let zIndex = 1;
                      
                      if (state === 'sorted') {
                        cardClass = 'bg-green-50 border-green-500';
                        shadowClass = 'shadow-lg shadow-green-200/50';
                      } else if (state === 'sorted-partial') {
                        cardClass = 'bg-green-50 border-green-400';
                        shadowClass = 'shadow-md shadow-green-100/40';
                      } else if (state === 'key') {
                        cardClass = 'bg-blue-100 border-blue-600';
                        shadowClass = 'shadow-2xl shadow-blue-400/70';
                        scaleValue = 1.08;
                        zIndex = 30; // Key element on top
                      } else if (state === 'minimum') {
                        cardClass = 'bg-cyan-50 border-cyan-500';
                        shadowClass = 'shadow-xl shadow-cyan-300/60';
                        scaleValue = 1.06;
                        zIndex = 15; // Minimum element highlighted
                      } else if (state === 'pivot') {
                        cardClass = 'bg-purple-50 border-purple-500';
                        shadowClass = 'shadow-xl shadow-purple-300/50';
                        scaleValue = 1.05;
                        zIndex = 10;
                      } else if (state === 'swapping') {
                        cardClass = 'bg-red-50 border-red-500';
                        shadowClass = 'shadow-2xl shadow-red-400/60';
                        scaleValue = 1.05;
                        zIndex = 20; // Bring swapping elements to front
                      } else if (state === 'comparing') {
                        cardClass = 'bg-blue-50 border-blue-500';
                        shadowClass = 'shadow-xl shadow-blue-400/60';
                        scaleValue = algorithm === 'merge' ? 1.1 : 1.05;
                        zIndex = 15;
                      } else if (isInActiveGroup && highlightIndices.length === 0) {
                        // Merge sort divide phase - yellow for groups being divided
                        cardClass = 'bg-yellow-50 border-yellow-300';
                        shadowClass = 'shadow-md shadow-yellow-200/40';
                      }
                      
                      return (
                        <motion.div
                          key={product.uniqueId}
                          layoutId={`card-${product.uniqueId}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: scaleValue,
                            zIndex: zIndex
                          }}
                          transition={{
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
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
                              <div className="text-blue-600 mt-1.5">
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
                </div>
              ) : (
                // Bar View with VisualGo-style design
                <div className="relative w-full min-h-[500px] overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F7FAFF] to-[#EEF3FF]">
                    {/* Floating gradient orbs */}
                    <motion.div
                      className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-2xl"
                      animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ top: '10%', left: '20%' }}
                    />
                    <motion.div
                      className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/30 to-pink-200/30 blur-2xl"
                      animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ top: '60%', right: '15%' }}
                    />
                  </div>

                  {/* Visualization Area */}
                  <div className="relative flex items-end justify-center h-[450px] w-full max-w-[1200px] mx-auto px-4 pb-2">
                    <div className="flex items-end justify-center w-full pb-8">
                      {array.map((product, index) => {
                        const state = getCardState(index);
                        
                        // Check if this bar is part of an active group being divided (for merge sort)
                        const isInActiveGroup = activeGroups && index >= activeGroups[0] && index <= activeGroups[1];
                        const isComparing = state === 'comparing';
                        const isMerged = mergedIndices.includes(index);
                        const verticalOffset = verticalOffsets.get(index) || 0;
                        
                        // VisualGo-style colors
                        let barColor = 'linear-gradient(180deg, #4A6FF7 0%, #A855F7 100%)';
                        let scaleValue = 1;
                        let glowColor = 'transparent';
                        
                        if (state === 'sorted') {
                          barColor = 'linear-gradient(180deg, #3BEA7E 0%, #22c55e 100%)';
                          glowColor = 'rgba(59, 234, 126, 0.3)';
                        } else if (state === 'key') {
                          barColor = 'linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)';
                          scaleValue = 1.12;
                          glowColor = 'rgba(59, 130, 246, 0.4)';
                        } else if (state === 'minimum') {
                          barColor = 'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)';
                          scaleValue = 1.08;
                          glowColor = 'rgba(34, 211, 238, 0.4)';
                        } else if (state === 'pivot') {
                          barColor = 'linear-gradient(180deg, #c084fc 0%, #9333ea 100%)';
                          scaleValue = 1.08;
                          glowColor = 'rgba(192, 132, 252, 0.4)';
                        } else if (state === 'swapping') {
                          barColor = 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)';
                          scaleValue = 1.1;
                          glowColor = 'rgba(248, 113, 113, 0.4)';
                        } else if (isComparing || (algorithm === 'merge' && isComparing)) {
                          barColor = 'linear-gradient(180deg, #FFD93D 0%, #F59E0B 100%)'; // Yellow for comparing
                          scaleValue = 1.12;
                          glowColor = 'rgba(255, 217, 61, 0.4)';
                        } else if (isMerged) {
                          barColor = 'linear-gradient(180deg, #3BEA7E 0%, #22c55e 100%)'; // Green for merged
                          glowColor = 'rgba(59, 234, 126, 0.3)';
                        }
                        
                        const maxPrice = Math.max(...array.map(p => p.price));
                        const barHeight = (product.price / maxPrice) * 320; // Max height 320px
                        const barWidth = Math.max(32, Math.min(60, 1100 / array.length));
                        
                        return (
                          <motion.div
                            key={product.uniqueId}
                            layoutId={`bar-${product.uniqueId}`}
                            className="flex flex-col items-center flex-shrink-0"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: 1,
                              y: verticalOffset
                            }}
                            transition={{
                              y: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                              opacity: { duration: 0.3 }
                            }}
                            style={{ 
                              width: `${barWidth}px`,
                              marginRight: '4px'
                            }}
                          >
                            {/* Product Icon (Icon View only) */}
                            {barViewMode === 'icon' && (
                              <motion.div
                                className="mb-2 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-200"
                                style={{
                                  width: '56px',
                                  height: '56px'
                                }}
                                animate={{
                                  scale: scaleValue
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            )}
                            
                            {/* Bar with gradient */}
                            <motion.div
                              animate={{ 
                                height: barHeight,
                                scale: scaleValue,
                                boxShadow: `0 0 20px ${glowColor}`
                              }}
                              transition={{
                                height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                scale: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                boxShadow: { duration: 0.3 }
                              }}
                              className="rounded-t-lg relative"
                              style={{
                                width: '100%',
                                background: barColor,
                                minHeight: '20px'
                              }}
                            >
                              {/* Price label */}
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                <span className="text-xs text-slate-700 bg-white/80 px-2 py-0.5 rounded shadow-sm">
                                  ₹{product.price.toFixed(0)}
                                </span>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Base line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300" />
                </div>
              )}
            </div>

            {/* Action Description */}
            <motion.div
              key={(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? currentAction : currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200"
            >
              <p className="text-sm text-blue-900">
                {(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? currentAction : (currentStepData?.action || 'Ready to start')}
              </p>
            </motion.div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Code Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-slate-900">Algorithm Code</h3>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm overflow-hidden">
                <div className="space-y-1">
                  {algorithmPseudocode[algorithm].map((line, index) => {
                    const isCurrentLine = index === getCurrentCodeLine();
                    const isEmpty = line.trim() === '';
                    
                    return (
                      <motion.div
                        key={index}
                        className={`px-3 py-1 rounded transition-all duration-300 ${
                          isEmpty 
                            ? '' 
                            : isCurrentLine 
                              ? 'bg-indigo-500/20 border-l-4 border-indigo-400' 
                              : 'hover:bg-slate-800'
                        }`}
                        animate={{
                          backgroundColor: isCurrentLine ? 'rgba(99, 102, 241, 0.2)' : 'transparent'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 select-none min-w-[24px] text-right">
                            {!isEmpty && (index + 1).toString().padStart(2, '0')}
                          </span>
                          <span className={`${
                            isEmpty 
                              ? 'text-transparent select-none' 
                              : isCurrentLine 
                                ? 'text-indigo-200' 
                                : 'text-slate-300'
                          }`}>
                            {isEmpty ? '.' : line}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-slate-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-xs text-blue-700 mb-1">Comparisons</div>
                  <motion.div
                    className="text-3xl text-blue-600"
                    key={(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? comparisons : (currentStepData?.comparisons || 0)}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? comparisons : (currentStepData?.comparisons || 0)}
                  </motion.div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                  <div className="text-xs text-red-700 mb-1">
                    {algorithm === 'insertion' ? 'Shifts' : algorithm === 'merge' ? 'Merges' : 'Swaps'}
                  </div>
                  <motion.div
                    className="text-3xl text-red-600"
                    key={(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? (algorithm === 'merge' ? merges : swaps) : (currentStepData?.swaps || 0)}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {(algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'insertion' || algorithm === 'selection') ? (algorithm === 'merge' ? merges : swaps) : (currentStepData?.swaps || 0)}
                  </motion.div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-xs text-purple-700 mb-1">Time Elapsed</div>
                  <div className="text-3xl text-purple-600">
                    {(elapsedTime / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-slate-900 mb-4">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={viewMode === 'cards' 
                      ? { borderWidth: '2px', borderColor: '#cbd5e1', backgroundColor: 'white' }
                      : { background: 'linear-gradient(180deg, #4A6FF7 0%, #A855F7 100%)' }
                    }
                  />
                  <span className="text-slate-700">Unsorted</span>
                </div>
                {algorithm === 'merge' && viewMode === 'bars' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ background: 'linear-gradient(180deg, #FFD93D 0%, #F59E0B 100%)' }}
                      />
                      <span className="text-slate-700">Comparing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ background: 'linear-gradient(180deg, #3BEA7E 0%, #22c55e 100%)' }}
                      />
                      <span className="text-slate-700">Merged/Sorted</span>
                    </div>
                  </>
                )}
                {algorithm === 'merge' && viewMode === 'cards' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded border-2 border-yellow-300 bg-yellow-50" />
                      <span className="text-slate-700">Dividing Range</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded border-2 border-blue-500 bg-blue-50" />
                      <span className="text-slate-700">Comparing</span>
                    </div>
                  </>
                )}
                {algorithm !== 'merge' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 ${viewMode === 'cards' ? 'border-blue-500 bg-blue-50' : 'bg-blue-400 border-blue-500'}`} />
                      <span className="text-slate-700">Comparing</span>
                    </div>
                  </>
                )}
                {algorithm !== 'merge' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 ${viewMode === 'cards' ? 'border-red-500 bg-red-50' : 'bg-red-400 border-red-500'}`} />
                    <span className="text-slate-700">Swapping</span>
                  </div>
                )}
                {algorithm !== 'merge' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 ${viewMode === 'cards' ? 'border-green-500 bg-green-50' : 'bg-green-400 border-green-500'}`} />
                    <span className="text-slate-700">Sorted</span>
                  </div>
                )}
                {algorithm === 'quick' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 ${viewMode === 'cards' ? 'border-purple-500 bg-purple-50' : 'bg-purple-400 border-purple-500'}`} />
                    <span className="text-slate-700">Pivot</span>
                  </div>
                )}
                {algorithm === 'insertion' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 ${viewMode === 'cards' ? 'border-blue-600 bg-blue-100' : 'bg-blue-400 border-blue-600'}`} />
                    <span className="text-slate-700">Key Element</span>
                  </div>
                )}
                {algorithm === 'selection' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 ${viewMode === 'cards' ? 'border-cyan-500 bg-cyan-50' : 'bg-cyan-400 border-cyan-500'}`} />
                    <span className="text-slate-700">Current Minimum</span>
                  </div>
                )}
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-indigo-900 mb-2">
                {algorithm === 'bubble' && 'Bubble Sort'}
                {algorithm === 'selection' && 'Selection Sort'}
                {algorithm === 'insertion' && 'Insertion Sort'}
                {algorithm === 'merge' && 'Merge Sort'}
              </h3>
              <p className="text-xs text-indigo-700">
                {algorithm === 'bubble' && 'Compares adjacent items and swaps them if they\'re in wrong order. Simple but slow for large datasets.'}
                {algorithm === 'selection' && 'Finds the minimum element and places it at the beginning. Simple and performs well on small datasets.'}
                {algorithm === 'insertion' && 'Builds sorted array one item at a time. Efficient for small or nearly sorted datasets.'}
                {algorithm === 'merge' && 'Divides array into smaller parts, sorts them, and merges. Very efficient for large datasets.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
