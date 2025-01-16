'use client'

import { useState, useMemo } from 'react'
import MenuItem from './MenuItem'
import SearchBar from './SearchBar'

// Define the type for a menu item
type MenuItem = {
  id: string;
  name: string;
  price: number | { Large: number; Medium: number; Small?: number };
  details: string;
  isPizza?: boolean;
};

// Define the structure for the menu data
const menuData: {
  Appetizers: MenuItem[];
  Burgers: MenuItem[];
  Sandwiches: MenuItem[];
  Drinks: MenuItem[];
  'DJ Extreme Pizzas': MenuItem[];
  'Dough Joe Special Pizzas': MenuItem[];
  Pasta: MenuItem[];
} = {
  Appetizers: [
    { id: 'a1', name: 'JELOPENO CHEESE STICKS', price: 575, details: 'Crispy, cheesy jalapeno bites served with dip' },
    { id: 'a2', name: 'BEHARI ROLL', price: 610, details: 'Spicy behari kabab wrapped in a soft roll' },
    { id: 'a3', name: 'OVEN BAKED HOT WINGS (6 PCS)', price: 550, details: 'Oven-baked chicken wings coated in a spicy sauce' },
    { id: 'a4', name: 'NUGGETS (6 PCS)', price: 425, details: 'Crispy chicken nuggets, served with a sauce of choice' },
    { id: 'a5', name: 'CHEESE FRIES', price: 320, details: 'Fries topped with melted cheddar cheese' },
    { id: 'a6', name: 'BBQ FRIES', price: 750, details: 'Loaded fries with BBQ sauce, chicken, and cheese' },
    { id: 'a7', name: 'BATTERED FRIES', price: 450, details: 'Thick-cut fries with a crispy outer layer' },
  ],
  Burgers: [
    { id: 'b1', name: 'CLASSIC CRISPY BURGER', price: 550, details: 'Fried chicken fillet, lettuce, and mayo in a soft bun' },
    { id: 'b2', name: 'CRUNCHY CHIPOTLE (Signature)', price: 875, details: 'Spicy chipotle chicken fillet, topped with jalapenos and cheese' },
    { id: 'b3', name: 'FIERY JOE', price: 690, details: 'Spicy chicken burger with a kick of hot sauce' },
    { id: 'b4', name: 'HOT CHICK', price: 650, details: 'A crispy chicken burger with a fiery sauce and pickles' },
    { id: 'b5', name: 'DJ SMASH (Signature)', price: 720, details: 'Double patty burger, loaded with cheese, sauces, and caramelized onions' },
    { id: 'b6', name: 'MELTING JOE', price: 690, details: 'A juicy chicken patty topped with melted cheese and DJ\'s signature sauce' },
    { id: 'b7', name: 'DJ MASH', price: 890, details: 'A loaded beef burger with mashed potatoes and a secret sauce' },
  ],
  Sandwiches: [
    { id: 's1', name: 'KABABISH SANDWICH', price: 950, details: 'Grilled kebab sandwich with lettuce, tomato, and sauce' },
    { id: 's2', name: 'CRUNCHY SANDWICH', price: 880, details: 'Crunchy chicken fillet sandwich with pickles and sauce' },
    { id: 's3', name: 'SUPREME SANDWICH', price: 825, details: 'A fully loaded sandwich with chicken, lettuce, cheese, and sauce' },
  ],
  Drinks: [
    { id: 'd1', name: 'CHEESE SLICE (100 Gram)', price: 80, details: 'Add an extra slice of cheddar cheese' },
    { id: 'd2', name: 'CHEESE SLICE (200 Gram)', price: 150, details: 'Add two slices of cheddar cheese' },
    { id: 'd3', name: 'DIP SAUCE', price: 70, details: 'A small container of house-made dipping sauce' },
    { id: 'd4', name: '1.5 LTR', price: 230, details: 'A large 1.5 liter soft drink' },
    { id: 'd5', name: '500 ML', price: 90, details: 'A regular 500 ml soft drink' },
    { id: 'd6', name: 'TEEN PACK', price: 150, details: 'Three cans of soft drink in a combo pack' },
  ],
  'DJ Extreme Pizzas': [
    { id: 'p1', name: 'DOUGH JOE\'S MALAI BOTTI FIESTA', price: { Large: 2450, Medium: 1725 }, details: 'Creamy malai boti topping on a cheesy pizza base', isPizza: true },
    { id: 'p2', name: 'VERY PERI-INTENSE', price: { Large: 2350, Medium: 1650 }, details: 'Peri-peri chicken with a spicy twist', isPizza: true },
    { id: 'p3', name: 'XTREME TIKKA', price: { Large: 2350, Medium: 1650 }, details: 'A desi twist of tikka flavors on a pizza base', isPizza: true },
  ],
  'Dough Joe Special Pizzas': [
    { id: 'p4', name: 'DJ SIGNATURE', price: { Large: 1850, Medium: 1450 }, details: 'Signature pizza with a blend of sauces and meats', isPizza: true },
    { id: 'p5', name: 'BEHARI KABAB', price: { Large: 1850, Medium: 1450 }, details: 'Spicy behari kabab topping on a cheesy pizza', isPizza: true },
    { id: 'p6', name: 'MALAI BOTTI', price: { Large: 1850, Medium: 1450 }, details: 'Tender malai boti pieces with a creamy sauce', isPizza: true },
    { id: 'p7', name: 'JOE\'S SPECIAL CROWN CRUST', price: { Large: 1850, Medium: 1450 }, details: 'A crown crust pizza loaded with cheesy bites', isPizza: true },
    { id: 'p8', name: 'CHICKEN SUPREME', price: { Large: 1750, Medium: 1275, Small: 550 }, details: 'A chicken-loaded supreme pizza', isPizza: true },
    { id: 'p9', name: 'CHICKEN FAJITA', price: { Large: 1750, Medium: 1275, Small: 550 }, details: 'Fajita-style chicken with peppers and onions', isPizza: true },
  ],
  Pasta: [
    { id: 'pa1', name: 'CREAMY PASTA', price: 990, details: 'Creamy, cheesy pasta with chicken' },
    { id: 'pa2', name: 'MACRONI PASTA', price: 775, details: 'Classic mac n\' cheese with chicken' },
    { id: 'pa3', name: 'DJ SPECIAL PASTA', price: 775, details: 'DJ\'s special pasta with a creamy sauce and toppings' },
  ],
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Appetizers')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMenuData = useMemo(() => {
    if (!searchQuery) return menuData

    const lowercaseQuery = searchQuery.toLowerCase()
    const filtered: Partial<typeof menuData> = {}

    Object.entries(menuData).forEach(([category, items]) => {
      const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.details.toLowerCase().includes(lowercaseQuery)
      )
      if (filteredItems.length > 0) {
        filtered[category as keyof typeof menuData] = filteredItems
      }
    })

    return filtered
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setActiveCategory(Object.keys(filteredMenuData)[0] || 'Appetizers')
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap mb-4">
        {Object.keys(filteredMenuData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`mr-2 mb-2 px-3 py-1 rounded ${
              activeCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredMenuData[activeCategory as keyof typeof menuData]?.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
