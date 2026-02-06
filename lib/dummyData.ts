import type { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  {
    id: "starter-1",
    name: "Royal Paneer Tikka",
    description: "Char grilled cottage cheese with saffron smoke and mint glaze.",
    price: 420,
    category: "Starters",
    isVeg: true,
    spiceLevel: "Medium",
    image:
      "https://images.unsplash.com/photo-1604908813066-3f1b4f9d0a42?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "starter-2",
    name: "Murgh Malai Seekh",
    description: "Velvety chicken skewers finished with cashew cream and herbs.",
    price: 480,
    category: "Starters",
    isVeg: false,
    spiceLevel: "Mild",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "main-1",
    name: "MLV Signature Dal Makhani",
    description: "Slow simmered black lentils with butter and a whisper of smoke.",
    price: 520,
    category: "Main Course",
    isVeg: true,
    spiceLevel: "Mild",
    image:
      "https://images.unsplash.com/photo-1628294896516-344152572ee2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "main-2",
    name: "Awadhi Mutton Curry",
    description: "Tender lamb in a rich onion gravy with warm royal spices.",
    price: 780,
    category: "Main Course",
    isVeg: false,
    spiceLevel: "Bold",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bread-1",
    name: "Butter Naan",
    description: "Soft hand stretched bread brushed with golden butter.",
    price: 120,
    category: "Breads",
    isVeg: true,
    spiceLevel: "Mild",
    image:
      "https://images.unsplash.com/photo-1547928577-3e4ec98bcf7c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bread-2",
    name: "Garlic Kulcha",
    description: "Oven baked bread with roasted garlic and herb aroma.",
    price: 140,
    category: "Breads",
    isVeg: true,
    spiceLevel: "Mild",
    image:
      "https://images.unsplash.com/photo-1626074389098-2dbf4f3b0ca4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "biryani-1",
    name: "Royal Chicken Biryani",
    description: "Fragrant basmati rice with tender chicken and saffron.",
    price: 620,
    category: "Biryani",
    isVeg: false,
    spiceLevel: "Medium",
    image:
      "https://images.unsplash.com/photo-1631515243342-5d28335a4d1e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "biryani-2",
    name: "Veg Biryani Royale",
    description: "Garden vegetables layered with aromatic rice and spices.",
    price: 520,
    category: "Biryani",
    isVeg: true,
    spiceLevel: "Medium",
    image:
      "https://images.unsplash.com/photo-1604909053142-1a25a7b2c3a8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beverage-1",
    name: "Kesar Lassi",
    description: "Chilled yogurt drink kissed with saffron and rose.",
    price: 220,
    category: "Beverages",
    isVeg: true,
    spiceLevel: "Mild",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "dessert-1",
    name: "Kesar Rasmalai",
    description: "Soft cheese discs soaked in saffron milk and pistachio.",
    price: 320,
    category: "Desserts",
    isVeg: true,
    spiceLevel: "Mild",
    image:
      "https://images.unsplash.com/photo-1601000938259-9e92002320d1?auto=format&fit=crop&w=600&q=80"
  }
];
