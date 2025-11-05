import { ChevronLeft, BookOpen, Zap, BarChart } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <h1 className="text-gray-900 mb-6">About Smart Shopping Cart & Inventory Visualizer</h1>

          <div className="space-y-6 text-gray-700">
            <p>
              Welcome to the Smart Shopping Cart & Inventory Visualizer – an interactive educational tool 
              designed to make learning sorting and searching algorithms intuitive and engaging through 
              a real-world shopping context.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Educational</h3>
                <p className="text-sm text-gray-600">
                  Learn DSA concepts through visual, step-by-step demonstrations
                </p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Interactive</h3>
                <p className="text-sm text-gray-600">
                  Control playback speed, data size, and experiment in real-time
                </p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Comparative</h3>
                <p className="text-sm text-gray-600">
                  Compare algorithm performance with detailed metrics and charts
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-gray-900 mb-3">Features</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Visual demonstrations of Bubble, Selection, Insertion, and Merge Sort algorithms</li>
                <li>Interactive Linear and Binary Search simulations</li>
                <li>Real-time metrics tracking (comparisons, swaps, steps)</li>
                <li>Performance comparison charts</li>
                <li>Adjustable animation speed and data size</li>
                <li>Pseudocode viewer with step highlighting</li>
              </ul>
            </div>

            <div>
              <h2 className="text-gray-900 mb-3">Why Shopping Context?</h2>
              <p>
                By using familiar shopping scenarios – sorting products by price, rating, or name, 
                and searching for specific items – students can better understand how these algorithms 
                work in practical applications they encounter daily.
              </p>
            </div>

            <div>
              <h2 className="text-gray-900 mb-3">Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-center text-sm">React</div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-center text-sm">TypeScript</div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-center text-sm">Tailwind CSS</div>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-center text-sm">Recharts</div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Built to visualize Data Structures & Algorithms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
