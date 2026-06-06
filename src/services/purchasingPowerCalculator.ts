import { 
  Smartphone, 
  Laptop, 
  Car, 
  Coffee, 
  Plane, 
  Home, 
  GraduationCap,
  Pizza,
  Dumbbell,
  Music,
  Book,
  Tv,
  Watch,
  ShoppingBag,
  Bike,
  Fuel,
  Utensils,
  Film,
  Shirt,
  Apple,
  type LucideIcon
} from "lucide-react";

export interface PurchasingItem {
  id: string;
  name: string;
  icon: LucideIcon;
  priceUSD: number;
  category: string;
  color: string;
  description?: string;
}

export interface PurchasingPowerResult {
  totalValue: number;
  btcAmount: number;
  currency: string;
  currentPrice: number;
  items: (PurchasingItem & { quantity: number; totalCost: number })[];
  categoryBreakdown: Record<string, { count: number; total: number }>;
  topItems: (PurchasingItem & { quantity: number; totalCost: number })[];
}

export const PURCHASING_ITEMS: PurchasingItem[] = [
  // Tech (10 items)
  { id: 'smartphone', name: 'iPhone 15 Pro', icon: Smartphone, priceUSD: 999, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'laptop', name: 'MacBook Pro', icon: Laptop, priceUSD: 2499, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'tablet', name: 'iPad Air', icon: Smartphone, priceUSD: 599, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'smartwatch', name: 'Apple Watch', icon: Watch, priceUSD: 399, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'tv', name: '65" OLED TV', icon: Tv, priceUSD: 1499, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'console', name: 'PlayStation 5', icon: Tv, priceUSD: 499, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'headphones', name: 'AirPods Pro', icon: Music, priceUSD: 249, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'camera', name: 'Canon EOS R6', icon: Film, priceUSD: 2499, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'drone', name: 'DJI Drone', icon: Plane, priceUSD: 799, category: 'Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'monitor', name: '4K Monitor 32"', icon: Tv, priceUSD: 699, category: 'Tech', color: 'from-blue-500 to-cyan-500' },

  // Transport (8 items)
  { id: 'used-car', name: 'Used Car', icon: Car, priceUSD: 25000, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'new-car', name: 'New Car (Mid-Range)', icon: Car, priceUSD: 35000, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'electric-car', name: 'Tesla Model 3', icon: Car, priceUSD: 45000, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'motorcycle', name: 'Motorcycle', icon: Bike, priceUSD: 8000, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'ebike', name: 'Electric Bike', icon: Bike, priceUSD: 2500, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'bicycle', name: 'Mountain Bike', icon: Bike, priceUSD: 800, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'scooter', name: 'Electric Scooter', icon: Bike, priceUSD: 500, category: 'Transport', color: 'from-purple-500 to-pink-500' },
  { id: 'gas', name: 'Tank of Gas', icon: Fuel, priceUSD: 50, category: 'Transport', color: 'from-purple-500 to-pink-500' },

  // Experiences (10 items)
  { id: 'flight-domestic', name: 'Domestic Flight', icon: Plane, priceUSD: 300, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'flight-international', name: 'International Flight', icon: Plane, priceUSD: 800, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'hotel-night', name: 'Hotel Night (4-Star)', icon: Home, priceUSD: 150, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'concert', name: 'Concert Ticket', icon: Music, priceUSD: 150, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'restaurant', name: 'Fine Dining Meal', icon: Utensils, priceUSD: 100, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'gym-year', name: 'Gym Membership (Annual)', icon: Dumbbell, priceUSD: 600, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'movie', name: 'Movie Ticket', icon: Film, priceUSD: 15, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'spa', name: 'Spa Day', icon: Home, priceUSD: 200, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'theme-park', name: 'Theme Park Ticket', icon: Film, priceUSD: 120, category: 'Experiences', color: 'from-orange-500 to-red-500' },
  { id: 'cruise', name: 'Week Cruise', icon: Plane, priceUSD: 2500, category: 'Experiences', color: 'from-orange-500 to-red-500' },

  // Education (8 items)
  { id: 'online-course', name: 'Online Course', icon: GraduationCap, priceUSD: 200, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'bootcamp', name: 'Coding Bootcamp', icon: GraduationCap, priceUSD: 10000, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'book', name: 'Hardcover Book', icon: Book, priceUSD: 25, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'textbook', name: 'College Textbook', icon: Book, priceUSD: 150, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'semester', name: 'University Semester', icon: GraduationCap, priceUSD: 15000, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'language', name: 'Language Course', icon: GraduationCap, priceUSD: 500, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'certification', name: 'Professional Certification', icon: GraduationCap, priceUSD: 300, category: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: 'masterclass', name: 'MasterClass Subscription', icon: GraduationCap, priceUSD: 180, category: 'Education', color: 'from-green-500 to-emerald-500' },

  // Lifestyle (10 items)
  { id: 'coffee', name: 'Latte', icon: Coffee, priceUSD: 5, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'pizza', name: 'Large Pizza', icon: Pizza, priceUSD: 20, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'groceries', name: 'Weekly Groceries', icon: ShoppingBag, priceUSD: 150, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'jeans', name: 'Designer Jeans', icon: Shirt, priceUSD: 150, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'sneakers', name: 'Premium Sneakers', icon: Shirt, priceUSD: 180, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'suit', name: 'Business Suit', icon: Shirt, priceUSD: 500, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'haircut', name: 'Haircut', icon: ShoppingBag, priceUSD: 40, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'phone-bill', name: 'Monthly Phone Bill', icon: Smartphone, priceUSD: 70, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'streaming', name: 'Streaming Services (Annual)', icon: Tv, priceUSD: 180, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },
  { id: 'dinner', name: 'Casual Dinner', icon: Utensils, priceUSD: 40, category: 'Lifestyle', color: 'from-yellow-500 to-amber-500' },

  // Luxury (5 items)
  { id: 'rolex', name: 'Rolex Watch', icon: Watch, priceUSD: 10000, category: 'Luxury', color: 'from-amber-500 to-yellow-600' },
  { id: 'designer-bag', name: 'Louis Vuitton Bag', icon: ShoppingBag, priceUSD: 3000, category: 'Luxury', color: 'from-amber-500 to-yellow-600' },
  { id: 'jewelry', name: 'Diamond Ring', icon: Watch, priceUSD: 5000, category: 'Luxury', color: 'from-amber-500 to-yellow-600' },
  { id: 'luxury-car', name: 'Luxury Car', icon: Car, priceUSD: 80000, category: 'Luxury', color: 'from-amber-500 to-yellow-600' },
  { id: 'first-class', name: 'First Class Flight', icon: Plane, priceUSD: 5000, category: 'Luxury', color: 'from-amber-500 to-yellow-600' },

  // Investments (8 items)
  { id: 'gold-oz', name: 'Gold Ounce', icon: Watch, priceUSD: 2000, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'sp500', name: 'S&P 500 Share', icon: Home, priceUSD: 450, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'tesla-stock', name: 'Tesla Share', icon: Car, priceUSD: 250, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'apple-stock', name: 'Apple Share', icon: Apple, priceUSD: 180, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'house-down', name: 'House Down Payment (20%)', icon: Home, priceUSD: 60000, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'rental-property', name: 'Rental Property', icon: Home, priceUSD: 200000, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'mutual-fund', name: 'Mutual Fund Share', icon: Home, priceUSD: 100, category: 'Investments', color: 'from-indigo-500 to-purple-500' },
  { id: 'bond', name: 'Treasury Bond', icon: Home, priceUSD: 1000, category: 'Investments', color: 'from-indigo-500 to-purple-500' },

  // Daily Essentials (10 items)
  { id: 'bread', name: 'Loaf of Bread', icon: Pizza, priceUSD: 3, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'milk', name: 'Gallon of Milk', icon: Coffee, priceUSD: 4, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'eggs', name: 'Dozen Eggs', icon: Pizza, priceUSD: 5, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'lunch', name: 'Lunch Special', icon: Utensils, priceUSD: 12, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, priceUSD: 8, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'water-bottle', name: 'Bottled Water', icon: Coffee, priceUSD: 2, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'sandwich', name: 'Sandwich', icon: Pizza, priceUSD: 7, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'energy-bill', name: 'Monthly Utilities', icon: Home, priceUSD: 150, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'internet', name: 'Monthly Internet', icon: Smartphone, priceUSD: 60, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
  { id: 'uber', name: 'Uber Ride', icon: Car, priceUSD: 15, category: 'Daily Essentials', color: 'from-teal-500 to-cyan-500' },
];

export class PurchasingPowerCalculator {
  static calculatePurchasingPower(
    btcAmount: number,
    currentPrice: number,
    currency: string
  ): PurchasingPowerResult {
    const totalValue = btcAmount * currentPrice;
    
    const itemQuantities = PURCHASING_ITEMS.map(item => ({
      ...item,
      quantity: Math.floor(totalValue / item.priceUSD),
      totalCost: Math.floor(totalValue / item.priceUSD) * item.priceUSD
    })).filter(item => item.quantity > 0);
    
    // Group by category
    const categoryBreakdown: Record<string, { count: number; total: number }> = {};
    itemQuantities.forEach(item => {
      if (!categoryBreakdown[item.category]) {
        categoryBreakdown[item.category] = { count: 0, total: 0 };
      }
      categoryBreakdown[item.category].count += 1;
      categoryBreakdown[item.category].total += item.totalCost;
    });
    
    // Sort by quantity descending and get top items
    const topItems = [...itemQuantities]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    return {
      totalValue,
      btcAmount,
      currency,
      currentPrice,
      items: itemQuantities,
      categoryBreakdown,
      topItems
    };
  }

  static formatQuantity(quantity: number): string {
    if (quantity >= 1000000) {
      return `${(quantity / 1000000).toFixed(1)}M`;
    }
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)}K`;
    }
    return quantity.toLocaleString();
  }

  static getCategoryColor(category: string): string {
    const item = PURCHASING_ITEMS.find(i => i.category === category);
    return item?.color || 'from-gray-500 to-gray-600';
  }
}
