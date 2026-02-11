// ═══════════════════════════════════════════════════════════════
// MLV Restaurant Menu - Exact Menu Data (Source of Truth)
// Mobile-first, modern digital menu with accurate pricing
// ═══════════════════════════════════════════════════════════════

export interface MenuItemVariant {
  label: string;
  price: number;
  isVeg?: boolean;
}

export interface MenuItemData {
  id: string;
  name: string;
  isVeg?: boolean;
  price?: number;
  variants?: MenuItemVariant[];
  description?: string;
}

export interface MenuCategoryData {
  id: string;
  name: string;
  description?: string;
  items: MenuItemData[];
}

// ═══════════════════════════════════════════════════════════════
// MENU DATA
// ═══════════════════════════════════════════════════════════════

export const menuCategories: MenuCategoryData[] = [
  // SOUPS
  {
    id: "soups",
    name: "Soups",
    items: [
      {
        id: "soup-1",
        name: "Lemon Coriander Soup",
        variants: [
          { label: "Veg", price: 140, isVeg: true },
          { label: "Non-Veg", price: 169, isVeg: false },
        ],
      },
      {
        id: "soup-2",
        name: "Manchow Soup",
        variants: [
          { label: "Veg", price: 140, isVeg: true },
          { label: "Non-Veg", price: 169, isVeg: false },
        ],
      },
      {
        id: "soup-3",
        name: "Hot & Sour Soup",
        variants: [
          { label: "Veg", price: 140, isVeg: true },
          { label: "Non-Veg", price: 169, isVeg: false },
        ],
      },
      {
        id: "soup-4",
        name: "Tom Yum Soup",
        isVeg: false,
        price: 199,
      },
      {
        id: "soup-5",
        name: "Cream of Tomato Soup",
        isVeg: true,
        price: 179,
      },
      {
        id: "soup-6",
        name: "Pepper Soup",
        variants: [
          { label: "Veg", price: 140, isVeg: true },
          { label: "Non-Veg", price: 169, isVeg: false },
        ],
      },
      {
        id: "soup-7",
        name: "Mutton Paya Soup",
        isVeg: false,
        price: 229,
      },
      {
        id: "soup-8",
        name: "Sweet Corn Soup",
        variants: [
          { label: "Veg", price: 140, isVeg: true },
          { label: "Non-Veg", price: 169, isVeg: false },
        ],
      },
    ],
  },

  // SALADS
  {
    id: "salads",
    name: "Salads",
    items: [
      {
        id: "salad-1",
        name: "American Green Garden Salad",
        isVeg: true,
        price: 179,
      },
      {
        id: "salad-2",
        name: "Caesar Salad",
        variants: [
          { label: "Veg", price: 180, isVeg: true },
          { label: "Non-Veg", price: 219, isVeg: false },
        ],
      },
      {
        id: "salad-3",
        name: "Grilled Chicken Salad",
        isVeg: false,
        price: 219,
      },
      {
        id: "salad-4",
        name: "Mixed Fruit Salad",
        isVeg: true,
        price: 199,
      },
    ],
  },

  // CONTINENTAL
  {
    id: "continental",
    name: "Continental",
    items: [
      {
        id: "cont-1",
        name: "French Fries",
        variants: [
          { label: "Plain", price: 139, isVeg: true },
          { label: "Peri-Peri", price: 149, isVeg: true },
          { label: "Cheesy", price: 189, isVeg: true },
        ],
      },
      {
        id: "cont-2",
        name: "Mexican Nachos",
        variants: [
          { label: "Veg", price: 189, isVeg: true },
          { label: "Non-Veg", price: 219, isVeg: false },
        ],
      },
      {
        id: "cont-3",
        name: "Garlic Bread",
        variants: [
          { label: "Plain", price: 179, isVeg: true },
          { label: "Cheese", price: 189, isVeg: true },
        ],
      },
      {
        id: "cont-4",
        name: "Cottage Cheesy Stick",
        isVeg: true,
        price: 210,
      },
      {
        id: "cont-5",
        name: "Onion Pakoda",
        isVeg: true,
        price: 159,
      },
      {
        id: "cont-6",
        name: "Chicken Wings Peri-Peri",
        isVeg: false,
        price: 349,
        description: "Non-Veg",
      },
      {
        id: "cont-7",
        name: "BBQ Chicken Wings",
        isVeg: false,
        price: 369,
        description: "Non-Veg",
      },
      {
        id: "cont-8",
        name: "Chicken Finger",
        isVeg: false,
        price: 309,
        description: "Non-Veg",
      },
      {
        id: "cont-9",
        name: "Fish Finger",
        isVeg: false,
        price: 359,
        description: "Non-Veg",
      },
      {
        id: "cont-10",
        name: "Fish & Chips",
        isVeg: false,
        price: 369,
        description: "Non-Veg",
      },
    ],
  },

  // TANDOORI STARTERS – VEG
  {
    id: "tandoori-veg",
    name: "Tandoori Starters - Veg",
    items: [
      {
        id: "tand-v1",
        name: "Royal Hara Bhara Kabab",
        isVeg: true,
        price: 249,
      },
      {
        id: "tand-v2",
        name: "Tandoori Mushroom",
        isVeg: true,
        price: 209,
      },
      {
        id: "tand-v3",
        name: "Sabji Malai Seekh",
        isVeg: true,
        price: 219,
      },
      {
        id: "tand-v4",
        name: "Malai Broccoli",
        isVeg: true,
        price: 259,
      },
      {
        id: "tand-v5",
        name: "Paneer Malai Tikka",
        isVeg: true,
        price: 299,
      },
      {
        id: "tand-v6",
        name: "Paneer Hariyali Tikka",
        isVeg: true,
        price: 299,
      },
      {
        id: "tand-v7",
        name: "Paneer Tikka",
        isVeg: true,
        price: 279,
      },
      {
        id: "tand-v8",
        name: "Bharwan Kumbh",
        isVeg: true,
        price: 229,
      },
      {
        id: "tand-v9",
        name: "Dhai-Anjeer-Ki-Kabab",
        isVeg: true,
        price: 299,
      },
    ],
  },

  // TANDOORI STARTERS – NON-VEG
  {
    id: "tandoori-non-veg",
    name: "Tandoori Starters - Non-Veg",
    items: [
      {
        id: "tand-nv1",
        name: "Tandoori Chicken",
        isVeg: false,
        variants: [
          { label: "Half", price: 299, isVeg: false },
          { label: "Full", price: 589, isVeg: false },
        ],
      },
      {
        id: "tand-nv2",
        name: "Kalmi Kabab",
        isVeg: false,
        variants: [
          { label: "Half", price: 199, isVeg: false },
          { label: "Full", price: 389, isVeg: false },
        ],
      },
      {
        id: "tand-nv3",
        name: "Chicken Tikka",
        isVeg: false,
        price: 309,
      },
      {
        id: "tand-nv4",
        name: "Murgh Malai Tikka",
        isVeg: false,
        price: 309,
      },
      {
        id: "tand-nv5",
        name: "Murgh Afghani",
        isVeg: false,
        variants: [
          { label: "Half", price: 310, isVeg: false },
          { label: "Full", price: 459, isVeg: false },
        ],
      },
      {
        id: "tand-nv6",
        name: "Kasturi Kabab",
        isVeg: false,
        variants: [
          { label: "2pc", price: 210, isVeg: false },
          { label: "4pc", price: 399, isVeg: false },
        ],
      },
      {
        id: "tand-nv7",
        name: "Chicken Pahadi Kabab",
        isVeg: false,
        price: 329,
      },
      {
        id: "tand-nv8",
        name: "Makhmali Chicken Tikka",
        isVeg: false,
        price: 309,
      },
      {
        id: "tand-nv9",
        name: "Chicken Seek Kabab",
        isVeg: false,
        price: 309,
      },
      {
        id: "tand-nv10",
        name: "Murgh Pakhtoni",
        isVeg: false,
        price: 309,
      },
      {
        id: "tand-nv11",
        name: "Basil Fish Tikka",
        isVeg: false,
        price: 329,
      },
      {
        id: "tand-nv12",
        name: "Lemon Tikka",
        isVeg: false,
        variants: [
          { label: "Fish", price: 309, isVeg: false },
          { label: "Chicken", price: 379, isVeg: false },
        ],
      },
      {
        id: "tand-nv13",
        name: "Tandoori Prawns",
        isVeg: false,
        price: 409,
      },
      {
        id: "tand-nv14",
        name: "Chicken Sikhari Shikari",
        isVeg: false,
        price: 349,
      },
      {
        id: "tand-nv15",
        name: "Mutton Seek Kabab",
        isVeg: false,
        price: 379,
      },
    ],
  },

  // PLATTERS
  {
    id: "platters",
    name: "Platters",
    items: [
      {
        id: "plat-1",
        name: "Tandoori Veg Platter",
        isVeg: true,
        price: 599,
      },
      {
        id: "plat-2",
        name: "Tandoori Chicken Platter",
        isVeg: false,
        price: 749,
      },
      {
        id: "plat-3",
        name: "Tandoori Non-Veg Platter",
        isVeg: false,
        price: 999,
      },
      {
        id: "plat-4",
        name: "Chinese Platter",
        isVeg: false,
        price: 599,
      },
    ],
  },

  // CHINESE STARTERS
  {
    id: "chinese-starters",
    name: "Chinese Starters",
    items: [
      {
        id: "chin-info",
        name: "Chinese Starters",
        description: "Veg items: ₹179–₹259 | Non-Veg items: ₹279–₹399",
      },
    ],
  },

  // MAIN COURSE – VEG
  {
    id: "main-veg",
    name: "Main Course - Veg",
    items: [
      {
        id: "mc-v1",
        name: "Kadai Paneer",
        isVeg: true,
        price: 289,
      },
      {
        id: "mc-v2",
        name: "Kadai Mushroom",
        isVeg: true,
        price: 249,
      },
      {
        id: "mc-v3",
        name: "Palak Paneer",
        isVeg: true,
        price: 289,
      },
      {
        id: "mc-v4",
        name: "Mix Veg",
        isVeg: true,
        price: 249,
      },
      {
        id: "mc-v5",
        name: "Mushroom Do Pyaza",
        isVeg: true,
        price: 249,
      },
      {
        id: "mc-v6",
        name: "Soya Chaap Masala",
        isVeg: true,
        price: 349,
      },
      {
        id: "mc-v7",
        name: "Shahi Paneer",
        isVeg: true,
        price: 309,
      },
      {
        id: "mc-v8",
        name: "Paneer Butter Masala",
        isVeg: true,
        price: 309,
      },
      {
        id: "mc-v9",
        name: "Paneer Tikka Masala",
        isVeg: true,
        price: 329,
      },
      {
        id: "mc-v10",
        name: "Paneer Pasanda",
        isVeg: true,
        price: 349,
      },
    ],
  },

  // MAIN COURSE – NON-VEG
  {
    id: "main-non-veg",
    name: "Main Course - Non-Veg",
    items: [
      {
        id: "mc-nv1",
        name: "Butter Chicken",
        isVeg: false,
        variants: [
          { label: "Bone", price: 349, isVeg: false },
          { label: "Boneless", price: 389, isVeg: false },
        ],
      },
      {
        id: "mc-nv2",
        name: "Kadai Chicken",
        isVeg: false,
        price: 349,
      },
      {
        id: "mc-nv3",
        name: "Chicken Kolhapuri",
        isVeg: false,
        price: 369,
      },
      {
        id: "mc-nv4",
        name: "Chicken Tikka Masala",
        isVeg: false,
        price: 369,
      },
      {
        id: "mc-nv5",
        name: "Chicken Hyderabadi",
        isVeg: false,
        price: 349,
      },
      {
        id: "mc-nv6",
        name: "Chicken Patiala",
        isVeg: false,
        price: 399,
      },
      {
        id: "mc-nv7",
        name: "Chicken Lababdar",
        isVeg: false,
        price: 369,
      },
      {
        id: "mc-nv8",
        name: "Mutton Rogan Josh",
        isVeg: false,
        price: 449,
      },
      {
        id: "mc-nv9",
        name: "Matka Chicken",
        isVeg: false,
        price: 399,
      },
    ],
  },

  // BIRYANI
  {
    id: "biryani",
    name: "Biryani",
    items: [
      // Non-Veg Biryani
      {
        id: "bir-nv1",
        name: "Chicken Dum Biryani",
        isVeg: false,
        price: 329,
      },
      {
        id: "bir-nv2",
        name: "Chicken Tikka Biryani",
        isVeg: false,
        price: 349,
      },
      {
        id: "bir-nv3",
        name: "Tandoori Chicken Biryani",
        isVeg: false,
        price: 349,
      },
      {
        id: "bir-nv4",
        name: "Fish Biryani",
        isVeg: false,
        price: 369,
      },
      {
        id: "bir-nv5",
        name: "Prawns Biryani",
        isVeg: false,
        price: 379,
      },
      {
        id: "bir-nv6",
        name: "Mutton Biryani",
        isVeg: false,
        price: 389,
      },
      {
        id: "bir-nv7",
        name: "MLV Special Biryani",
        isVeg: false,
        price: 459,
      },
      // Veg Biryani
      {
        id: "bir-v1",
        name: "Veg Biryani",
        isVeg: true,
        price: 249,
      },
      {
        id: "bir-v2",
        name: "Paneer Biryani",
        isVeg: true,
        price: 269,
      },
      {
        id: "bir-v3",
        name: "Mushroom Biryani",
        isVeg: true,
        price: 259,
      },
      {
        id: "bir-v4",
        name: "Paneer Tikka Biryani",
        isVeg: true,
        price: 289,
      },
      {
        id: "bir-v5",
        name: "Veg Special Biryani",
        isVeg: true,
        price: 299,
      },
    ],
  },

  // PIZZA
  {
    id: "pizza",
    name: "Pizza",
    items: [
      {
        id: "pizza-1",
        name: "Pizza (Veg)",
        isVeg: true,
        variants: [
          { label: "Regular", price: 349, isVeg: true },
          { label: "Large", price: 389, isVeg: true },
        ],
      },
      {
        id: "pizza-2",
        name: "Pizza (Non-Veg)",
        isVeg: false,
        variants: [
          { label: "Regular", price: 429, isVeg: false },
          { label: "Large", price: 479, isVeg: false },
        ],
      },
    ],
  },

  // PASTA
  {
    id: "pasta",
    name: "Pasta",
    items: [
      {
        id: "pasta-1",
        name: "Alfredo Pasta",
        isVeg: true,
        price: 349,
      },
      {
        id: "pasta-2",
        name: "Arrabiata Pasta",
        isVeg: true,
        price: 349,
      },
      {
        id: "pasta-3",
        name: "Basil Pesto Pasta",
        isVeg: true,
        price: 359,
      },
      {
        id: "pasta-add",
        name: "Add-Ons",
        description:
          "Extra Chicken ₹50 | Cheese ₹40 | Veg ₹30",
      },
    ],
  },

  // DESSERTS & ICE CREAM
  {
    id: "desserts",
    name: "Desserts & Ice Cream",
    items: [
      {
        id: "des-1",
        name: "Gulab Jamun (2 pcs)",
        isVeg: true,
        price: 159,
      },
      {
        id: "des-2",
        name: "Gulab Jamun + Ice Cream",
        isVeg: true,
        price: 199,
      },
      {
        id: "des-3",
        name: "Ras Malai",
        isVeg: true,
        price: 189,
      },
      {
        id: "des-4",
        name: "Sizzling Brownie + Ice Cream",
        isVeg: true,
        price: 249,
      },
      {
        id: "des-5",
        name: "Ice Cream (2 scoops)",
        isVeg: true,
        variants: [
          { label: "Regular", price: 129, isVeg: true },
          { label: "Premium", price: 169, isVeg: true },
        ],
      },
    ],
  },

  // BEVERAGES
  {
    id: "beverages",
    name: "Beverages",
    items: [
      {
        id: "bev-1",
        name: "Lassi",
        isVeg: true,
        variants: [
          { label: "Regular", price: 159, isVeg: true },
          { label: "Special", price: 179, isVeg: true },
        ],
      },
      {
        id: "bev-2",
        name: "Milkshakes",
        isVeg: true,
        variants: [
          { label: "Regular", price: 169, isVeg: true },
          { label: "Special", price: 179, isVeg: true },
        ],
      },
      {
        id: "bev-3",
        name: "Fresh Lime Soda",
        isVeg: true,
        price: 99,
      },
      {
        id: "bev-4",
        name: "Soft Drinks",
        isVeg: true,
        price: 99,
      },
      {
        id: "bev-5",
        name: "Juices",
        isVeg: true,
        price: 149,
      },
    ],
  },
];
