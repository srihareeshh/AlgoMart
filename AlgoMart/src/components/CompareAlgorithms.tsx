import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { generateRandomProducts } from '../utils/productData';
import { bubbleSort, selectionSort, mergeSort, insertionSort, linearSearch, binarySearch } from '../utils/algorithms';
import { Navigation } from './Navigation';

interface CompareAlgorithmsProps {
  onNavigate: (page: string) => void;
}

export function CompareAlgorithms({ onNavigate }: CompareAlgorithmsProps) {
  const [algorithmType, setAlgorithmType] = useState<'sorting' | 'searching'>('sorting');
  const [inputSize, setInputSize] = useState(12);
  const [dataType, setDataType] = useState<'random' | 'sorted' | 'reverse'>('random');
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    generateComparisonData();
  }, [algorithmType, inputSize, dataType]);

  const generateComparisonData = () => {
    const products = generateRandomProducts(inputSize);
    
    if (dataType === 'sorted') {
      products.sort((a, b) => a.price - b.price);
    } else if (dataType === 'reverse') {
      products.sort((a, b) => b.price - a.price);
    }

    if (algorithmType === 'sorting') {
      const bubbleSteps = bubbleSort([...products], 'price');
      const selectionSteps = selectionSort([...products], 'price');
      const insertionSteps = insertionSort([...products], 'price');
      const mergeSteps = mergeSort([...products], 'price');

      const data = [
        {
          name: 'Bubble Sort',
          comparisons: bubbleSteps[bubbleSteps.length - 1]?.comparisons || 0,
          swaps: bubbleSteps[bubbleSteps.length - 1]?.swaps || 0,
          steps: bubbleSteps.length,
          color: '#3B82F6'
        },
        {
          name: 'Selection Sort',
          comparisons: selectionSteps[selectionSteps.length - 1]?.comparisons || 0,
          swaps: selectionSteps[selectionSteps.length - 1]?.swaps || 0,
          steps: selectionSteps.length,
          color: '#10B981'
        },
        {
          name: 'Insertion Sort',
          comparisons: insertionSteps[insertionSteps.length - 1]?.comparisons || 0,
          swaps: insertionSteps[insertionSteps.length - 1]?.swaps || 0,
          steps: insertionSteps.length,
          color: '#F59E0B'
        },
        {
          name: 'Merge Sort',
          comparisons: mergeSteps[mergeSteps.length - 1]?.comparisons || 0,
          swaps: mergeSteps[mergeSteps.length - 1]?.swaps || 0,
          steps: mergeSteps.length,
          color: '#8B5CF6'
        }
      ];

      setComparisonData(data);
    } else {
      const searchTerm = products[Math.floor(products.length / 2)].name;
      const linearSteps = linearSearch([...products], searchTerm);
      const binarySteps = binarySearch([...products], searchTerm);

      const data = [
        {
          name: 'Linear Search',
          steps: linearSteps[linearSteps.length - 1]?.steps || 0,
          comparisons: linearSteps.length,
          color: '#3B82F6'
        },
        {
          name: 'Binary Search',
          steps: binarySteps[binarySteps.length - 1]?.steps || 0,
          comparisons: binarySteps.length,
          color: '#10B981'
        }
      ];

      setComparisonData(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="compare" onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">Algorithm Performance Comparison</h2>
          <p className="text-gray-600">Compare the efficiency of different algorithms</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Algorithm Type</label>
              <select
                value={algorithmType}
                onChange={(e) => setAlgorithmType(e.target.value as 'sorting' | 'searching')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sorting">Sorting Algorithms</option>
                <option value="searching">Searching Algorithms</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Input Size</label>
              <input
                type="number"
                min="5"
                max="50"
                value={inputSize}
                onChange={(e) => setInputSize(parseInt(e.target.value) || 12)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Data Type</label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as 'random' | 'sorted' | 'reverse')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="random">Random</option>
                <option value="sorted">Sorted</option>
                <option value="reverse">Reverse Sorted</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'bar' | 'line')}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {algorithmType === 'sorting' ? (
            <>
              {/* Comparisons Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-900 mb-4">Comparisons</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="comparisons" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="comparisons" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Swaps Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-gray-900 mb-4">Swaps</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="swaps" fill="#10B981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="swaps" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Total Steps Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
                <h3 className="text-gray-900 mb-4">Total Steps</h3>
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === 'bar' ? (
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Steps', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="steps" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Steps', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="steps" stroke="#8B5CF6" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              {/* Search Steps Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
                <h3 className="text-gray-900 mb-4">Search Steps Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  {chartType === 'bar' ? (
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Steps', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="steps" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Steps', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="steps" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
          <h3 className="text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData.map((algo, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="text-gray-900 mb-2">{algo.name}</div>
                <div className="space-y-1 text-sm">
                  {algorithmType === 'sorting' ? (
                    <>
                      <div className="text-gray-600">
                        Comparisons: <span className="text-blue-600">{algo.comparisons}</span>
                      </div>
                      <div className="text-gray-600">
                        Swaps: <span className="text-green-600">{algo.swaps}</span>
                      </div>
                      <div className="text-gray-600">
                        Steps: <span className="text-purple-600">{algo.steps}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-600">
                        Steps: <span className="text-blue-600">{algo.steps}</span>
                      </div>
                      <div className="text-gray-600">
                        Complexity: <span className="text-purple-600">
                          {algo.name.includes('Linear') ? 'O(n)' : 'O(log n)'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Info */}
        <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-200 mt-6">
          <h3 className="text-blue-900 mb-3">Understanding Algorithm Complexity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="mb-2"><strong>Sorting Algorithms:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bubble Sort: O(n²) - Simple but slow</li>
                <li>Selection Sort: O(n²) - Simple with minimum swaps</li>
                <li>Insertion Sort: O(n²) - Efficient for small/nearly sorted data</li>
                <li>Merge Sort: O(n log n) - Consistent performance</li>
              </ul>
            </div>
            <div>
              <p className="mb-2"><strong>Searching Algorithms:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Linear Search: O(n) - Works on any data</li>
                <li>Binary Search: O(log n) - Requires sorted data</li>
                <li>Binary search is exponentially faster for large datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
