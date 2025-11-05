import { Product } from './productData';

// 🧠 Utility Deep Clone (safe for nested objects, preserves _uid and all properties)
function deepClone<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        // Preserve all properties including _uid
        return { ...item };
      }
      return item;
    }) as T;
  }
  if (typeof obj === 'object' && obj !== null) {
    return { ...obj } as T;
  }
  return obj;
}

export interface SortStep {
  array: Product[];
  comparisons: number;
  swaps: number;
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  mergeRange?: { left: number; right: number };
  action?: 'comparing' | 'swapping' | 'merging' | 'pivot' | 'idle' | 'start' | 'shifting' | 'inserting' | 'selecting' | 'completed' | 'done';
  description?: string;
}

export interface SearchStep {
  products: Product[];
  currentIndex: number;
  foundIndex: number | null;
  checkedIndices: number[];
  steps: number;
}

// Sorting Algorithms
export function bubbleSort(arr: Product[], sortBy: 'price' | 'rating' | 'name'): SortStep[] {
  const steps: SortStep[] = [];
  const array = deepClone(arr);
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  const compare = (a: Product, b: Product) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return a.rating - b.rating;
    return a.name.localeCompare(b.name);
  };

  // Initial step
  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: [],
    action: 'start',
    description: 'Starting Bubble Sort...'
  });

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        action: 'comparing',
        description: `Comparing elements at index ${j} and ${j + 1}`
      });

      if (compare(array[j], array[j + 1]) > 0) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        steps.push({
          array: deepClone(array),
          comparisons,
          swaps,
          activeIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          action: 'swapping',
          description: `Swapping elements at index ${j} and ${j + 1}`
        });
      }
    }
    sortedIndices.push(array.length - i - 1);
  }

  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    action: 'idle',
    description: 'Sorting complete!'
  });

  return steps;
}

export function selectionSort(arr: Product[], sortBy: 'price' | 'rating' | 'name'): SortStep[] {
  const steps: SortStep[] = [];
  const array = deepClone(arr);
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  const compare = (a: Product, b: Product) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return a.rating - b.rating;
    return a.name.localeCompare(b.name);
  };

  // Initial step
  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: [],
    action: 'start',
    description: 'Starting Selection Sort...'
  });

  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [j, minIndex],
        sortedIndices: [...sortedIndices],
        action: 'comparing',
        description: `Comparing elements at index ${j} and ${minIndex}`
      });

      if (compare(array[j], array[minIndex]) < 0) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [i, minIndex],
        sortedIndices: [...sortedIndices],
        action: 'swapping',
        description: `Swapping elements at index ${i} and ${minIndex}`
      });
    }
    
    sortedIndices.push(i);
  }

  sortedIndices.push(array.length - 1);

  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    action: 'idle',
    description: 'Sorting complete!'
  });

  return steps;
}

export function insertionSort(arr: Product[], sortBy: 'price' | 'rating' | 'name'): SortStep[] {
  const steps: SortStep[] = [];
  const array = deepClone(arr);
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [0];

  const compare = (a: Product, b: Product) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return a.rating - b.rating;
    return a.name.localeCompare(b.name);
  };

  // Initial step
  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: [0],
    action: 'start',
    description: 'Starting Insertion Sort...'
  });

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      array: deepClone(array),
      comparisons,
      swaps,
      activeIndices: [i],
      sortedIndices: [...sortedIndices],
      action: 'selecting',
      description: `Selecting element at index ${i} as key`
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        action: 'comparing',
        description: `Comparing elements at index ${j} and ${j + 1}`
      });

      if (compare(array[j], key) > 0) {
        array[j + 1] = array[j];
        swaps++;
        steps.push({
          array: deepClone(array),
          comparisons,
          swaps,
          activeIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          action: 'shifting',
          description: `Shifting element at index ${j} to ${j + 1}`
        });
        j--;
      } else {
        break;
      }
    }

    array[j + 1] = key;
    steps.push({
      array: deepClone(array),
      comparisons,
      swaps,
      activeIndices: [j + 1],
      sortedIndices: [...sortedIndices],
      action: 'inserting',
      description: `Inserting key at index ${j + 1}`
    });

    sortedIndices.push(i);
  }

  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    action: 'idle',
    description: 'Sorting complete!'
  });

  return steps;
}

export function mergeSort(arr: Product[], sortBy: 'price' | 'rating' | 'name'): SortStep[] {
  const steps: SortStep[] = [];
  const array = deepClone(arr);
  let comparisons = 0;
  let swaps = 0;

  const compare = (a: Product, b: Product) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return a.rating - b.rating;
    return a.name.localeCompare(b.name);
  };

  // Initial step
  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: [],
    action: 'start',
    description: 'Starting Merge Sort...'
  });

  function merge(left: number, mid: number, right: number) {
    const leftArr = array.slice(left, mid + 1).map(item => ({ ...item }));
    const rightArr = array.slice(mid + 1, right + 1).map(item => ({ ...item }));
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      
      // Step 1: Lift the bars being compared (Visualgo-style)
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [left + i, mid + 1 + j],
        sortedIndices: [],
        mergeRange: { left, right },
        action: 'comparing',
        description: `Comparing elements at index ${left + i} and ${mid + 1 + j}`
      });

      // Step 2: Perform the merge and show merging action
      if (compare(leftArr[i], rightArr[j]) <= 0) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      swaps++;
      
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [k],
        sortedIndices: [],
        mergeRange: { left, right },
        action: 'merging',
        description: `Placing element at position ${k}`
      });
      
      k++;
    }

    while (i < leftArr.length) {
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [k],
        sortedIndices: [],
        mergeRange: { left, right },
        action: 'merging',
        description: `Placing remaining element at position ${k}`
      });
      
      array[k] = leftArr[i];
      i++;
      k++;
      swaps++;
    }

    while (j < rightArr.length) {
      steps.push({
        array: deepClone(array),
        comparisons,
        swaps,
        activeIndices: [k],
        sortedIndices: [],
        mergeRange: { left, right },
        action: 'merging',
        description: `Placing remaining element at position ${k}`
      });
      
      array[k] = rightArr[j];
      j++;
      k++;
      swaps++;
    }
  }

  function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSortHelper(0, array.length - 1);

  steps.push({
    array: deepClone(array),
    comparisons,
    swaps,
    activeIndices: [],
    sortedIndices: Array.from({ length: array.length }, (_, i) => i),
    action: 'idle',
    description: 'Sorting complete!'
  });

  return steps;
}

// Searching Algorithms
export function linearSearch(arr: Product[], searchTerm: string): SearchStep[] {
  const steps: SearchStep[] = [];
  const checkedIndices: number[] = [];
  let foundIndex: number | null = null;

  for (let i = 0; i < arr.length; i++) {
    checkedIndices.push(i);
    
    // Check if search term matches:
    // 1. Exact ID match
    // 2. Exact product name match (case-insensitive)
    const exactIdMatch = arr[i].id.toString() === searchTerm;
    const exactNameMatch = arr[i].name.toLowerCase() === searchTerm.toLowerCase();
    
    const found = exactIdMatch || exactNameMatch;

    steps.push({
      products: arr,
      currentIndex: i,
      foundIndex: found ? i : null,
      checkedIndices: [...checkedIndices],
      steps: i + 1
    });

    if (found) {
      foundIndex = i;
      break;
    }
  }

  // If not found, add final step showing "not found"
  if (foundIndex === null && steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    steps.push({
      products: arr,
      currentIndex: -1,
      foundIndex: null,
      checkedIndices: lastStep.checkedIndices,
      steps: lastStep.steps
    });
  }

  return steps;
}

export function binarySearch(arr: Product[], searchTerm: string): SearchStep[] {
  const steps: SearchStep[] = [];
  const checkedIndices: number[] = [];
  
  // Sort array by name for binary search
  const sortedArr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
  
  let left = 0;
  let right = sortedArr.length - 1;
  let foundIndex: number | null = null;
  let stepCount = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    checkedIndices.push(mid);
    stepCount++;

    steps.push({
      products: sortedArr,
      currentIndex: mid,
      foundIndex: null,
      checkedIndices: [...checkedIndices],
      steps: stepCount
    });

    // Check for exact match (name or ID)
    const productName = sortedArr[mid].name.toLowerCase();
    const search = searchTerm.toLowerCase();
    const exactNameMatch = productName === search;
    const exactIdMatch = sortedArr[mid].id.toString() === searchTerm;
    
    if (exactNameMatch || exactIdMatch) {
      foundIndex = mid;
      steps.push({
        products: sortedArr,
        currentIndex: mid,
        foundIndex: mid,
        checkedIndices: [...checkedIndices],
        steps: stepCount
      });
      break;
    }

    // Use alphabetical comparison to navigate the search space
    const comparison = productName.localeCompare(search);
    
    if (comparison < 0) {
      // Product name comes before search term alphabetically
      left = mid + 1;
    } else {
      // Product name comes after search term alphabetically
      right = mid - 1;
    }
  }

  // If not found, add final step showing "not found"
  if (foundIndex === null) {
    steps.push({
      products: sortedArr,
      currentIndex: -1,
      foundIndex: null,
      checkedIndices: [...checkedIndices],
      steps: stepCount
    });
  }

  return steps;
}