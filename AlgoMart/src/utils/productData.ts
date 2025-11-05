export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  description?: string;
}

export const ecommerceProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 7199,
    rating: 4.5,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYyMjAyNDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Crystal clear audio with active noise cancellation"
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 23999,
    rating: 4.8,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNofGVufDF8fHx8MTc2MjE3NTg2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Track fitness, heart rate, and notifications"
  },
  {
    id: 3,
    name: "Ultra Slim Laptop",
    price: 103999,
    rating: 4.9,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjIxNjA4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Powerful performance in a sleek design"
  },
  {
    id: 4,
    name: "Smartphone X Pro",
    price: 71999,
    rating: 4.7,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1732998369893-af4c9a4695fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZGV2aWNlfGVufDF8fHx8MTc2MjIwMzkxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "5G enabled with stunning camera quality"
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    price: 5599,
    rating: 4.4,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVldG9vdGglMjBzcGVha2VyfGVufDF8fHx8MTc2MjE2NjIyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "360° surround sound, waterproof design"
  },
  {
    id: 6,
    name: "Running Shoes Elite",
    price: 9599,
    rating: 4.6,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYyMjE5MTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Lightweight with superior cushioning"
  },
  {
    id: 7,
    name: "Travel Backpack",
    price: 6399,
    rating: 4.5,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1680039211156-66c721b87625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMGJhZ3xlbnwxfHx8fDE3NjIyMjU0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Durable, spacious with USB charging port"
  },
  {
    id: 8,
    name: "Designer Sunglasses",
    price: 11999,
    rating: 4.3,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1663585703603-9be01a72a62a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjIyMjc5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "UV protection with premium polarized lenses"
  },
  {
    id: 9,
    name: "Premium Cotton T-Shirt",
    price: 2799,
    rating: 4.2,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1759572095329-1dcf9522762b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0c2hpcnQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjIyNDk3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Soft, breathable, and eco-friendly"
  },
  {
    id: 10,
    name: "Professional DSLR Camera",
    price: 119999,
    rating: 4.9,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjIyMTEwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "4K video, 45MP sensor, weather sealed"
  },
  {
    id: 11,
    name: "Modern Desk Lamp",
    price: 3599,
    rating: 4.4,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1621447980929-6638614633c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcHxlbnwxfHx8fDE3NjIxNjMxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Adjustable brightness, USB powered"
  },
  {
    id: 12,
    name: "Insulated Water Bottle",
    price: 2399,
    rating: 4.7,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NjIxNTE0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Keeps drinks cold for 24 hours"
  },
  {
    id: 13,
    name: "Mechanical Gaming Keyboard",
    price: 12799,
    rating: 4.8,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1705488387173-b3e4890259ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlib2FyZCUyMG1lY2hhbmljYWx8ZW58MXx8fHwxNzYyMjM2MjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "RGB backlit, tactile switches, programmable"
  },
  {
    id: 14,
    name: "Ergonomic Office Chair",
    price: 27999,
    rating: 4.6,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjaGFpcnxlbnwxfHx8fDE3NjIyMjU1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Lumbar support, adjustable height and arms"
  },
  {
    id: 15,
    name: "Smart Coffee Maker",
    price: 10399,
    rating: 4.5,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1608354580875-30bd4168b351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtYWtlcnxlbnwxfHx8fDE3NjIyMDM5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Programmable with built-in grinder"
  },
  {
    id: 16,
    name: "Premium Yoga Mat",
    price: 3999,
    rating: 4.7,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1646239646963-b0b9be56d6b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWF0fGVufDF8fHx8MTc2MjIzMzM1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Non-slip, eco-friendly, extra cushioning"
  },
  {
    id: 17,
    name: "10-inch Tablet",
    price: 31999,
    rating: 4.5,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1672239069328-dd1535c0d78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzYyMjIwOTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "HD display, 128GB storage, all-day battery"
  },
  {
    id: 18,
    name: "Fitness Tracker Watch",
    price: 6399,
    rating: 4.3,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587400519568-1fe0329bfb2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB3YXRjaHxlbnwxfHx8fDE3NjIyNDk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Step counter, sleep tracking, heart rate monitor"
  },
  {
    id: 19,
    name: "Hardside Luggage Set",
    price: 19999,
    rating: 4.6,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1531938716357-224c16b5ace3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBzdWl0Y2FzZXxlbnwxfHx8fDE3NjIxNjIxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Scratch-resistant, spinner wheels, TSA lock"
  },
  {
    id: 20,
    name: "Fast Portable Charger",
    price: 3199,
    rating: 4.8,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1619489646924-b4fce76b1db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMGNoYXJnZXJ8ZW58MXx8fHwxNzYyMjE4MzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "20000mAh, charges 3 devices simultaneously"
  }
];

export const sampleProducts: Product[] = ecommerceProducts;

export function generateRandomProducts(count: number): Product[] {
  const products: Product[] = [];
  const names = [
    "Wireless Headphones", "Smart Watch", "Coffee Maker", "Backpack", 
    "Desk Lamp", "Running Shoes", "Water Bottle", "Bluetooth Speaker",
    "Notebook Set", "Yoga Mat", "Phone Case", "USB Cable", "Tablet",
    "Keyboard", "Mouse", "Monitor", "Chair", "Desk", "Sunglasses", "Hat"
  ];
  const emojis = ["🎧", "⌚", "☕", "🎒", "💡", "👟", "💧", "🔊", "📓", "🧘", "📱", "🔌", "📱", "⌨️", "🖱️", "🖥️", "🪑", "🏢", "🕶️", "🎩"];
  const categories = ["Electronics", "Home", "Fashion", "Sports", "Office", "Accessories"];

  for (let i = 0; i < count; i++) {
    const nameIndex = i % names.length;
    products.push({
      id: i + 1,
      name: names[nameIndex],
      price: Math.round((Math.random() * 22400 + 1600) / 100) * 100,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      category: categories[Math.floor(Math.random() * categories.length)],
      image: emojis[nameIndex]
    });
  }
  
  return products;
}
