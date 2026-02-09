// ─────────────────────────────────────────────────────────────
// Hotel MLV Grand — Complete Menu Data (200+ items)
// Based on actual restaurant menu categories & pricing
// ─────────────────────────────────────────────────────────────

export interface DummyMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  spiceLevel: "Mild" | "Medium" | "Hot" | "Extra Hot";
  prepTime: number; // minutes
  image: string;
}

const IMG = {
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
  soupNv: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=600&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  continental: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  tandooriVeg: "https://images.unsplash.com/photo-1604908813066-3f1b4f9d0a42?auto=format&fit=crop&w=600&q=80",
  tandooriNv: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
  kebab: "https://images.unsplash.com/photo-1628294895950-98052523e036?auto=format&fit=crop&w=600&q=80",
  egg: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80",
  platter: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  chineseVeg: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
  chineseNv: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80",
  indianDry: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  curryVeg: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  curryNv: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80",
  biryaniNv: "https://images.unsplash.com/photo-1631515243342-5d28335a4d1e?auto=format&fit=crop&w=600&q=80",
  biryaniVeg: "https://images.unsplash.com/photo-1604909053142-1a25a7b2c3a8?auto=format&fit=crop&w=600&q=80",
  friedRice: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
  indianRice: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80",
  dal: "https://images.unsplash.com/photo-1628294896516-344152572ee2?auto=format&fit=crop&w=600&q=80",
  naan: "https://images.unsplash.com/photo-1547928577-3e4ec98bcf7c?auto=format&fit=crop&w=600&q=80",
  roti: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  pasta: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80",
  dessert: "https://images.unsplash.com/photo-1601000938259-9e92002320d1?auto=format&fit=crop&w=600&q=80",
  icecream: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80",
  juice: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80",
  tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
  lassi: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  prawns: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80",
  mutton: "https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=600&q=80",
  chicken: "https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?auto=format&fit=crop&w=600&q=80",
  paneer: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
};

export const menuItems: DummyMenuItem[] = [
  // ═══════════════════════════════════════════════
  // SOUPS (8 items)
  // ═══════════════════════════════════════════════
  { id: "soup-1", name: "Tomato Soup", description: "Classic roasted tomato soup with fresh basil and cream swirl.", price: 150, category: "Soups", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.soup },
  { id: "soup-2", name: "Sweet Corn Soup (Veg)", description: "Creamy sweet corn broth with garden vegetables and pepper.", price: 160, category: "Soups", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.soup },
  { id: "soup-3", name: "Hot & Sour Soup (Veg)", description: "Tangy and spicy oriental soup with tofu and mushrooms.", price: 170, category: "Soups", isVeg: true, spiceLevel: "Hot", prepTime: 10, image: IMG.soup },
  { id: "soup-4", name: "Manchow Soup (Veg)", description: "Thick vegetable soup served with crispy fried noodles.", price: 180, category: "Soups", isVeg: true, spiceLevel: "Medium", prepTime: 10, image: IMG.soup },
  { id: "soup-5", name: "Chicken Sweet Corn Soup", description: "Shredded chicken in a silky sweet corn broth.", price: 190, category: "Soups", isVeg: false, spiceLevel: "Mild", prepTime: 10, image: IMG.soupNv },
  { id: "soup-6", name: "Chicken Hot & Sour Soup", description: "Spicy and tangy soup loaded with chicken and vegetables.", price: 200, category: "Soups", isVeg: false, spiceLevel: "Hot", prepTime: 10, image: IMG.soupNv },
  { id: "soup-7", name: "Chicken Manchow Soup", description: "Rich chicken broth with vegetables and crispy noodle topping.", price: 200, category: "Soups", isVeg: false, spiceLevel: "Medium", prepTime: 10, image: IMG.soupNv },
  { id: "soup-8", name: "Cream of Mushroom Soup", description: "Velvety mushroom soup with herb croutons.", price: 180, category: "Soups", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.soup },

  // ═══════════════════════════════════════════════
  // SALADS (4 items)
  // ═══════════════════════════════════════════════
  { id: "salad-1", name: "Green Garden Salad", description: "Fresh lettuce, cucumber, tomato, and olives with lemon vinaigrette.", price: 180, category: "Salads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.salad },
  { id: "salad-2", name: "Caesar Salad", description: "Crisp romaine, parmesan, croutons, and classic Caesar dressing.", price: 220, category: "Salads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.salad },
  { id: "salad-3", name: "Grilled Chicken Salad", description: "Chargrilled chicken on a bed of mixed greens with honey mustard.", price: 280, category: "Salads", isVeg: false, spiceLevel: "Mild", prepTime: 12, image: IMG.salad },
  { id: "salad-4", name: "Greek Salad", description: "Feta cheese, olives, tomato, onion, and cucumber with herbs.", price: 240, category: "Salads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.salad },

  // ═══════════════════════════════════════════════
  // CONTINENTAL STARTERS (10 items: 5 veg + 5 non-veg)
  // ═══════════════════════════════════════════════
  { id: "cont-v1", name: "Veg Spring Rolls", description: "Crispy rolls stuffed with cabbage, carrots, and glass noodles.", price: 220, category: "Continental Starters", isVeg: true, spiceLevel: "Mild", prepTime: 15, image: IMG.continental },
  { id: "cont-v2", name: "Paneer Fingers", description: "Golden fried paneer sticks with spicy mayo dip.", price: 260, category: "Continental Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.paneer },
  { id: "cont-v3", name: "Mushroom Croquettes", description: "Breaded mushroom and cheese croquettes, crispy fried.", price: 240, category: "Continental Starters", isVeg: true, spiceLevel: "Mild", prepTime: 15, image: IMG.continental },
  { id: "cont-v4", name: "Stuffed Jalapeños", description: "Cream cheese stuffed jalapeños, battered and fried.", price: 250, category: "Continental Starters", isVeg: true, spiceLevel: "Hot", prepTime: 15, image: IMG.continental },
  { id: "cont-v5", name: "Veg Nachos Grande", description: "Tortilla chips loaded with cheese, salsa, and sour cream.", price: 280, category: "Continental Starters", isVeg: true, spiceLevel: "Medium", prepTime: 12, image: IMG.continental },
  { id: "cont-nv1", name: "Chicken Wings BBQ", description: "Smoky BBQ glazed chicken wings, fall-off-the-bone tender.", price: 320, category: "Continental Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.chicken },
  { id: "cont-nv2", name: "Fish Fingers", description: "Crumb-coated fish fillets, golden fried with tartar sauce.", price: 340, category: "Continental Starters", isVeg: false, spiceLevel: "Mild", prepTime: 15, image: IMG.continental },
  { id: "cont-nv3", name: "Chicken Nuggets", description: "Tender chicken breast nuggets with honey mustard dip.", price: 280, category: "Continental Starters", isVeg: false, spiceLevel: "Mild", prepTime: 15, image: IMG.chicken },
  { id: "cont-nv4", name: "Prawn Tempura", description: "Lightly battered prawns, deep fried to crispy perfection.", price: 380, category: "Continental Starters", isVeg: false, spiceLevel: "Mild", prepTime: 15, image: IMG.prawns },
  { id: "cont-nv5", name: "Lamb Seekh Kebab Platter", description: "Charcoal grilled lamb seekh with mint chutney.", price: 360, category: "Continental Starters", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.kebab },

  // ═══════════════════════════════════════════════
  // TANDOORI STARTERS (24 items: 9 veg + 15 non-veg)
  // ═══════════════════════════════════════════════
  { id: "tand-v1", name: "Paneer Tikka", description: "Char grilled cottage cheese with saffron smoke and mint glaze.", price: 280, category: "Tandoori Starters", isVeg: true, spiceLevel: "Medium", prepTime: 18, image: IMG.tandooriVeg },
  { id: "tand-v2", name: "Hara Bhara Kebab", description: "Spinach and green pea patties spiced with fresh herbs.", price: 240, category: "Tandoori Starters", isVeg: true, spiceLevel: "Mild", prepTime: 15, image: IMG.kebab },
  { id: "tand-v3", name: "Mushroom Tikka", description: "Button mushrooms marinated in tandoori spices and grilled.", price: 260, category: "Tandoori Starters", isVeg: true, spiceLevel: "Medium", prepTime: 18, image: IMG.tandooriVeg },
  { id: "tand-v4", name: "Dahi Ke Sholay", description: "Crispy bread pockets filled with spiced hung yogurt.", price: 250, category: "Tandoori Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.tandooriVeg },
  { id: "tand-v5", name: "Malai Chaap", description: "Soy chaap marinated in creamy malai and grilled on charcoal.", price: 270, category: "Tandoori Starters", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.tandooriVeg },
  { id: "tand-v6", name: "Achari Paneer Tikka", description: "Cottage cheese in tangy pickle marinade, charcoal grilled.", price: 290, category: "Tandoori Starters", isVeg: true, spiceLevel: "Hot", prepTime: 18, image: IMG.paneer },
  { id: "tand-v7", name: "Veg Seekh Kebab", description: "Minced vegetable seekh with aromatic spices, grilled.", price: 240, category: "Tandoori Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.kebab },
  { id: "tand-v8", name: "Stuffed Mushroom", description: "Mushrooms stuffed with cheese and herbs, tandoor baked.", price: 280, category: "Tandoori Starters", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.tandooriVeg },
  { id: "tand-v9", name: "Paneer Malai Tikka", description: "Soft paneer in a creamy cashew and saffron marinade.", price: 300, category: "Tandoori Starters", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.paneer },
  { id: "tand-nv1", name: "Chicken Tikka", description: "Classic boneless chicken tikka with smoky charcoal flavor.", price: 300, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.tandooriNv },
  { id: "tand-nv2", name: "Malai Chicken Tikka", description: "Creamy, melt-in-mouth chicken tikka with cashew paste.", price: 320, category: "Tandoori Starters", isVeg: false, spiceLevel: "Mild", prepTime: 18, image: IMG.tandooriNv },
  { id: "tand-nv3", name: "Tandoori Chicken (Half)", description: "Classic tandoori chicken, smoky and juicy.", price: 300, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.chicken },
  { id: "tand-nv4", name: "Tandoori Chicken (Full)", description: "Whole tandoori chicken marinated overnight in spices.", price: 520, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.chicken },
  { id: "tand-nv5", name: "Chicken Seekh Kebab", description: "Minced chicken seekh with garam masala, charcoal grilled.", price: 280, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.kebab },
  { id: "tand-nv6", name: "Murgh Malai Seekh", description: "Velvety chicken skewers finished with cashew cream and herbs.", price: 300, category: "Tandoori Starters", isVeg: false, spiceLevel: "Mild", prepTime: 18, image: IMG.tandooriNv },
  { id: "tand-nv7", name: "Afghan Chicken", description: "Cream and cheese marinated chicken, grilled golden.", price: 340, category: "Tandoori Starters", isVeg: false, spiceLevel: "Mild", prepTime: 20, image: IMG.chicken },
  { id: "tand-nv8", name: "Tandoori Prawns", description: "Jumbo prawns marinated in ajwain yogurt, grilled to perfection.", price: 450, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.prawns },
  { id: "tand-nv9", name: "Fish Tikka", description: "Boneless fish chunks in tandoori marinade, charcoal smoked.", price: 380, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.continental },
  { id: "tand-nv10", name: "Mutton Seekh Kebab", description: "Juicy minced mutton seekh with warm spices.", price: 350, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.mutton },
  { id: "tand-nv11", name: "Reshmi Kebab", description: "Silky smooth chicken kebab with saffron and cream.", price: 300, category: "Tandoori Starters", isVeg: false, spiceLevel: "Mild", prepTime: 18, image: IMG.tandooriNv },
  { id: "tand-nv12", name: "Hariyali Chicken Tikka", description: "Chicken tikka in green mint-coriander marinade.", price: 310, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.tandooriNv },
  { id: "tand-nv13", name: "Achari Chicken Tikka", description: "Pickle-spiced chicken tikka, tangy and smoky.", price: 310, category: "Tandoori Starters", isVeg: false, spiceLevel: "Hot", prepTime: 18, image: IMG.chicken },
  { id: "tand-nv14", name: "Lamb Chops", description: "Tender lamb chops marinated in royal spices, grilled.", price: 550, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.mutton },
  { id: "tand-nv15", name: "Chicken Wings Tandoori", description: "Spiced chicken wings cooked in clay oven, smoky and tender.", price: 280, category: "Tandoori Starters", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.chicken },

  // ═══════════════════════════════════════════════
  // EGG ITEMS (8 items)
  // ═══════════════════════════════════════════════
  { id: "egg-1", name: "Egg Bhurji", description: "Indian style scrambled eggs with onion, tomato, and green chili.", price: 150, category: "Egg Items", isVeg: false, spiceLevel: "Medium", prepTime: 10, image: IMG.egg },
  { id: "egg-2", name: "Masala Omelette", description: "Fluffy omelette loaded with onions, chilies, and coriander.", price: 130, category: "Egg Items", isVeg: false, spiceLevel: "Medium", prepTime: 10, image: IMG.egg },
  { id: "egg-3", name: "Egg Curry", description: "Boiled eggs simmered in rich onion-tomato gravy.", price: 200, category: "Egg Items", isVeg: false, spiceLevel: "Medium", prepTime: 15, image: IMG.egg },
  { id: "egg-4", name: "Egg Fried Rice", description: "Wok-tossed rice with scrambled eggs and vegetables.", price: 200, category: "Egg Items", isVeg: false, spiceLevel: "Mild", prepTime: 12, image: IMG.friedRice },
  { id: "egg-5", name: "Egg Biryani", description: "Fragrant basmati rice layered with spiced boiled eggs.", price: 220, category: "Egg Items", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.biryaniNv },
  { id: "egg-6", name: "Bread Omelette", description: "Toasted bread sandwich with masala omelette filling.", price: 140, category: "Egg Items", isVeg: false, spiceLevel: "Mild", prepTime: 10, image: IMG.egg },
  { id: "egg-7", name: "Egg Noodles", description: "Stir-fried noodles with scrambled eggs and veggies.", price: 200, category: "Egg Items", isVeg: false, spiceLevel: "Medium", prepTime: 12, image: IMG.noodles },
  { id: "egg-8", name: "Egg Manchurian", description: "Boiled eggs in a spicy Manchurian sauce.", price: 220, category: "Egg Items", isVeg: false, spiceLevel: "Hot", prepTime: 15, image: IMG.egg },

  // ═══════════════════════════════════════════════
  // PLATTERS (4 combo platters)
  // ═══════════════════════════════════════════════
  { id: "plat-1", name: "Veg Starter Platter", description: "Paneer tikka, hara bhara kebab, mushroom tikka, and dips.", price: 550, category: "Platters", isVeg: true, spiceLevel: "Medium", prepTime: 20, image: IMG.platter },
  { id: "plat-2", name: "Non-Veg Starter Platter", description: "Chicken tikka, seekh kebab, tandoori wings, and mint chutney.", price: 650, category: "Platters", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.platter },
  { id: "plat-3", name: "MLV Grand Platter", description: "Chef's selection of premium starters, veg and non-veg mix.", price: 850, category: "Platters", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.platter },
  { id: "plat-4", name: "Seafood Platter", description: "Tandoori prawns, fish tikka, prawn tempura with cocktail sauce.", price: 900, category: "Platters", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.prawns },

  // ═══════════════════════════════════════════════
  // CHINESE STARTERS (17 items: 8 veg + 9 non-veg)
  // ═══════════════════════════════════════════════
  { id: "chin-v1", name: "Veg Manchurian Dry", description: "Crispy vegetable balls tossed in tangy Manchurian sauce.", price: 220, category: "Chinese Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseVeg },
  { id: "chin-v2", name: "Gobi Manchurian Dry", description: "Cauliflower florets in a spicy Indo-Chinese glaze.", price: 220, category: "Chinese Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseVeg },
  { id: "chin-v3", name: "Paneer Chilli Dry", description: "Wok-tossed paneer with bell peppers in chili sauce.", price: 260, category: "Chinese Starters", isVeg: true, spiceLevel: "Hot", prepTime: 15, image: IMG.chineseVeg },
  { id: "chin-v4", name: "Baby Corn Manchurian", description: "Crispy baby corn in Manchurian sauce with spring onion.", price: 230, category: "Chinese Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseVeg },
  { id: "chin-v5", name: "Crispy Honey Chilli Potato", description: "Crispy fried potatoes tossed in sweet chili honey glaze.", price: 220, category: "Chinese Starters", isVeg: true, spiceLevel: "Medium", prepTime: 12, image: IMG.chineseVeg },
  { id: "chin-v6", name: "Veg Salt & Pepper", description: "Assorted veggies with crushed pepper and aromatic spices.", price: 220, category: "Chinese Starters", isVeg: true, spiceLevel: "Medium", prepTime: 12, image: IMG.chineseVeg },
  { id: "chin-v7", name: "Mushroom Chilli", description: "Button mushrooms in spicy Indo-Chinese chilli sauce.", price: 240, category: "Chinese Starters", isVeg: true, spiceLevel: "Hot", prepTime: 15, image: IMG.chineseVeg },
  { id: "chin-v8", name: "Veg Lollipop", description: "Vegetable lollipop fritters with tangy Schezwan dip.", price: 220, category: "Chinese Starters", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseVeg },
  { id: "chin-nv1", name: "Chicken Manchurian Dry", description: "Chicken balls tossed in spicy Manchurian sauce.", price: 280, category: "Chinese Starters", isVeg: false, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseNv },
  { id: "chin-nv2", name: "Chilli Chicken Dry", description: "Boneless chicken in fiery Indo-Chinese chilli sauce.", price: 280, category: "Chinese Starters", isVeg: false, spiceLevel: "Hot", prepTime: 15, image: IMG.chineseNv },
  { id: "chin-nv3", name: "Dragon Chicken", description: "Crispy chicken strips in Schezwan dragon sauce.", price: 300, category: "Chinese Starters", isVeg: false, spiceLevel: "Extra Hot", prepTime: 15, image: IMG.chineseNv },
  { id: "chin-nv4", name: "Chicken 65", description: "South Indian spicy deep-fried chicken with curry leaves.", price: 270, category: "Chinese Starters", isVeg: false, spiceLevel: "Hot", prepTime: 15, image: IMG.chineseNv },
  { id: "chin-nv5", name: "Chicken Lollipop", description: "Spiced chicken drumettes, fried crispy with Schezwan sauce.", price: 280, category: "Chinese Starters", isVeg: false, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseNv },
  { id: "chin-nv6", name: "Chicken Salt & Pepper", description: "Tender chicken tossed with crushed pepper and garlic.", price: 280, category: "Chinese Starters", isVeg: false, spiceLevel: "Medium", prepTime: 12, image: IMG.chineseNv },
  { id: "chin-nv7", name: "Honey Chilli Chicken", description: "Crispy chicken glazed in sweet honey chili sauce.", price: 290, category: "Chinese Starters", isVeg: false, spiceLevel: "Medium", prepTime: 15, image: IMG.chineseNv },
  { id: "chin-nv8", name: "Prawn Salt & Pepper", description: "Crispy prawns with crushed pepper, garlic, and spring onion.", price: 380, category: "Chinese Starters", isVeg: false, spiceLevel: "Medium", prepTime: 15, image: IMG.prawns },
  { id: "chin-nv9", name: "Fish Chilli", description: "Boneless fish pieces in spicy chilli garlic sauce.", price: 350, category: "Chinese Starters", isVeg: false, spiceLevel: "Hot", prepTime: 15, image: IMG.continental },

  // ═══════════════════════════════════════════════
  // INDIAN FLAVOURS — Non-Veg Dry (5 items)
  // ═══════════════════════════════════════════════
  { id: "indf-1", name: "Chicken Sukka", description: "Dry chicken preparation with coconut and Mangalorean spices.", price: 300, category: "Indian Flavours", isVeg: false, spiceLevel: "Hot", prepTime: 18, image: IMG.indianDry },
  { id: "indf-2", name: "Pepper Chicken Dry", description: "Black pepper crusted chicken, aromatic and fiery.", price: 300, category: "Indian Flavours", isVeg: false, spiceLevel: "Hot", prepTime: 18, image: IMG.chicken },
  { id: "indf-3", name: "Mutton Fry", description: "Tender mutton pieces deep fried with curry leaves and spices.", price: 380, category: "Indian Flavours", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.mutton },
  { id: "indf-4", name: "Chicken Roast", description: "Whole chicken pieces roasted with a blend of royal spices.", price: 320, category: "Indian Flavours", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.chicken },
  { id: "indf-5", name: "Andhra Chilli Chicken", description: "Fiery Andhra-style chicken with dried red chilies.", price: 300, category: "Indian Flavours", isVeg: false, spiceLevel: "Extra Hot", prepTime: 18, image: IMG.indianDry },

  // ═══════════════════════════════════════════════
  // MAIN COURSE VEG CURRIES (11 items)
  // ═══════════════════════════════════════════════
  { id: "mc-v1", name: "Paneer Butter Masala", description: "Cottage cheese in a rich, creamy tomato butter gravy.", price: 280, category: "Main Course Veg", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.paneer },
  { id: "mc-v2", name: "Kadhai Paneer", description: "Cottage cheese tossed with bell peppers and pounded coriander seeds.", price: 280, category: "Main Course Veg", isVeg: true, spiceLevel: "Medium", prepTime: 18, image: IMG.curryVeg },
  { id: "mc-v3", name: "Palak Paneer", description: "Cottage cheese cubes in a creamy spinach gravy.", price: 260, category: "Main Course Veg", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.curryVeg },
  { id: "mc-v4", name: "Shahi Paneer", description: "Paneer in a luxurious cashew and saffron cream sauce.", price: 300, category: "Main Course Veg", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.paneer },
  { id: "mc-v5", name: "Malai Kofta", description: "Potato and cheese dumplings in a cashew saffron gravy.", price: 280, category: "Main Course Veg", isVeg: true, spiceLevel: "Mild", prepTime: 20, image: IMG.curryVeg },
  { id: "mc-v6", name: "Aloo Gobi Masala", description: "Potato and cauliflower in dry spiced masala.", price: 220, category: "Main Course Veg", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.curryVeg },
  { id: "mc-v7", name: "Mixed Veg Curry", description: "Seasonal vegetables in a spiced onion-tomato gravy.", price: 220, category: "Main Course Veg", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.curryVeg },
  { id: "mc-v8", name: "Chana Masala", description: "Chickpeas simmered in tangy, spiced tomato gravy.", price: 220, category: "Main Course Veg", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.curryVeg },
  { id: "mc-v9", name: "Mushroom Masala", description: "Button mushrooms in a rich onion and tomato curry.", price: 250, category: "Main Course Veg", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.curryVeg },
  { id: "mc-v10", name: "Veg Kolhapuri", description: "Mixed vegetables in a fiery Kolhapuri masala.", price: 240, category: "Main Course Veg", isVeg: true, spiceLevel: "Hot", prepTime: 18, image: IMG.curryVeg },
  { id: "mc-v11", name: "Navratan Korma", description: "Nine jewel curry with fruits, nuts, and cream.", price: 280, category: "Main Course Veg", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.curryVeg },

  // ═══════════════════════════════════════════════
  // MAIN COURSE NON-VEG CURRIES (14 items)
  // ═══════════════════════════════════════════════
  { id: "mc-nv1", name: "Butter Chicken", description: "Classic tandoori chicken simmered in creamy tomato gravy.", price: 320, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Mild", prepTime: 18, image: IMG.curryNv },
  { id: "mc-nv2", name: "Chicken Tikka Masala", description: "Grilled chicken tikka in a rich spiced tomato sauce.", price: 320, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.curryNv },
  { id: "mc-nv3", name: "Kadhai Chicken", description: "Chicken with bell peppers in a wok-style kadhai masala.", price: 300, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.curryNv },
  { id: "mc-nv4", name: "Chicken Chettinad", description: "South Indian style chicken in aromatic Chettinad spices.", price: 320, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Hot", prepTime: 20, image: IMG.curryNv },
  { id: "mc-nv5", name: "Mughlai Chicken", description: "Rich Mughlai style chicken with cashews and cream.", price: 340, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Mild", prepTime: 20, image: IMG.curryNv },
  { id: "mc-nv6", name: "Chicken Do Pyaza", description: "Chicken cooked with double onion in a robust gravy.", price: 300, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.curryNv },
  { id: "mc-nv7", name: "Rogan Josh", description: "Kashmiri style lamb curry with aromatic spices.", price: 380, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.mutton },
  { id: "mc-nv8", name: "Mutton Curry", description: "Tender mutton in a classic onion-tomato gravy.", price: 380, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.mutton },
  { id: "mc-nv9", name: "Keema Matar", description: "Spiced minced mutton with green peas.", price: 340, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.mutton },
  { id: "mc-nv10", name: "Fish Curry", description: "Fresh fish in a tangy coconut-based curry.", price: 350, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.continental },
  { id: "mc-nv11", name: "Prawn Masala", description: "Juicy prawns in a spiced onion-tomato masala.", price: 420, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.prawns },
  { id: "mc-nv12", name: "Chicken Korma", description: "Mild chicken curry with yogurt, nuts, and saffron.", price: 320, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Mild", prepTime: 20, image: IMG.curryNv },
  { id: "mc-nv13", name: "Awadhi Mutton Curry", description: "Tender lamb in a rich onion gravy with warm royal spices.", price: 400, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.mutton },
  { id: "mc-nv14", name: "Egg Masala Curry", description: "Boiled eggs in a flavorful masala gravy.", price: 220, category: "Main Course Non-Veg", isVeg: false, spiceLevel: "Medium", prepTime: 15, image: IMG.egg },

  // ═══════════════════════════════════════════════
  // BIRYANI — Regular (14 items: 8 non-veg + 6 veg)
  // ═══════════════════════════════════════════════
  { id: "bir-nv1", name: "Chicken Dum Biryani", description: "Fragrant basmati rice with tender chicken, slow cooked in dum.", price: 280, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv2", name: "Mutton Dum Biryani", description: "Rich mutton biryani with saffron and fried onions.", price: 350, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv3", name: "Hyderabadi Chicken Biryani", description: "Authentic Hyderabadi style chicken biryani with raita.", price: 300, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv4", name: "Hyderabadi Mutton Biryani", description: "Slow cooked lamb and rice with mint, saffron, and fried onions.", price: 380, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv5", name: "Prawns Biryani", description: "Juicy prawns layered with fragrant basmati rice.", price: 400, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv6", name: "Fish Biryani", description: "Boneless fish pieces layered with aromatic rice.", price: 350, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv7", name: "Keema Biryani", description: "Minced meat biryani with aromatic spices.", price: 300, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-nv8", name: "MLV Special Chicken Biryani", description: "Chef's special recipe with extra rich masala and saffron.", price: 350, category: "Biryani", isVeg: false, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniNv },
  { id: "bir-v1", name: "Veg Dum Biryani", description: "Garden vegetables layered with aromatic rice and saffron.", price: 220, category: "Biryani", isVeg: true, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniVeg },
  { id: "bir-v2", name: "Paneer Biryani", description: "Cottage cheese cubes with fragrant spiced rice.", price: 260, category: "Biryani", isVeg: true, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniVeg },
  { id: "bir-v3", name: "Mushroom Biryani", description: "Button mushrooms with aromatic basmati rice.", price: 250, category: "Biryani", isVeg: true, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniVeg },
  { id: "bir-v4", name: "Soya Chunk Biryani", description: "Protein-rich soya chunks biryani with warm spices.", price: 220, category: "Biryani", isVeg: true, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniVeg },
  { id: "bir-v5", name: "Hyderabadi Veg Biryani", description: "Authentic Hyderabadi style with mixed vegetables.", price: 240, category: "Biryani", isVeg: true, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniVeg },
  { id: "bir-v6", name: "MLV Special Veg Biryani", description: "Chef's special vegetable biryani with premium ingredients.", price: 280, category: "Biryani", isVeg: true, spiceLevel: "Medium", prepTime: 25, image: IMG.biryaniVeg },

  // ═══════════════════════════════════════════════
  // BIRYANI — Family Pack (6 items)
  // ═══════════════════════════════════════════════
  { id: "birfp-1", name: "Chicken Biryani Family Pack", description: "Serves 4-5 people. Dum cooked chicken biryani with raita.", price: 700, category: "Biryani Family Pack", isVeg: false, spiceLevel: "Medium", prepTime: 30, image: IMG.biryaniNv },
  { id: "birfp-2", name: "Mutton Biryani Family Pack", description: "Serves 4-5 people. Rich mutton dum biryani with salan.", price: 900, category: "Biryani Family Pack", isVeg: false, spiceLevel: "Medium", prepTime: 30, image: IMG.biryaniNv },
  { id: "birfp-3", name: "Hyderabadi Chicken Family Pack", description: "Serves 4-5 people. Authentic Hyderabadi chicken biryani.", price: 750, category: "Biryani Family Pack", isVeg: false, spiceLevel: "Medium", prepTime: 30, image: IMG.biryaniNv },
  { id: "birfp-4", name: "Veg Biryani Family Pack", description: "Serves 4-5 people. Vegetable dum biryani with raita.", price: 550, category: "Biryani Family Pack", isVeg: true, spiceLevel: "Medium", prepTime: 30, image: IMG.biryaniVeg },
  { id: "birfp-5", name: "Paneer Biryani Family Pack", description: "Serves 4-5 people. Paneer biryani with premium spices.", price: 650, category: "Biryani Family Pack", isVeg: true, spiceLevel: "Medium", prepTime: 30, image: IMG.biryaniVeg },
  { id: "birfp-6", name: "MLV Special Family Pack", description: "Serves 4-5 people. Chef's special biryani, choice of veg/non-veg.", price: 850, category: "Biryani Family Pack", isVeg: false, spiceLevel: "Medium", prepTime: 30, image: IMG.biryaniNv },

  // ═══════════════════════════════════════════════
  // FRIED RICE (7 items)
  // ═══════════════════════════════════════════════
  { id: "fr-1", name: "Veg Fried Rice", description: "Wok-tossed rice with mixed vegetables and soy sauce.", price: 200, category: "Fried Rice", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.friedRice },
  { id: "fr-2", name: "Schezwan Veg Fried Rice", description: "Spicy Schezwan sauce tossed with rice and vegetables.", price: 220, category: "Fried Rice", isVeg: true, spiceLevel: "Hot", prepTime: 12, image: IMG.friedRice },
  { id: "fr-3", name: "Mushroom Fried Rice", description: "Fried rice with sliced mushrooms and aromatic garlic.", price: 220, category: "Fried Rice", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.friedRice },
  { id: "fr-4", name: "Chicken Fried Rice", description: "Classic chicken fried rice with egg and vegetables.", price: 250, category: "Fried Rice", isVeg: false, spiceLevel: "Mild", prepTime: 12, image: IMG.friedRice },
  { id: "fr-5", name: "Schezwan Chicken Fried Rice", description: "Fiery Schezwan chicken rice with crunchy vegetables.", price: 270, category: "Fried Rice", isVeg: false, spiceLevel: "Hot", prepTime: 12, image: IMG.friedRice },
  { id: "fr-6", name: "Prawns Fried Rice", description: "Succulent prawns wok-tossed with fried rice.", price: 320, category: "Fried Rice", isVeg: false, spiceLevel: "Mild", prepTime: 12, image: IMG.friedRice },
  { id: "fr-7", name: "Mixed Non-Veg Fried Rice", description: "Chicken, prawns, and egg in a loaded fried rice.", price: 300, category: "Fried Rice", isVeg: false, spiceLevel: "Medium", prepTime: 12, image: IMG.friedRice },

  // ═══════════════════════════════════════════════
  // NOODLES (6 items)
  // ═══════════════════════════════════════════════
  { id: "nood-1", name: "Veg Hakka Noodles", description: "Stir-fried noodles with fresh vegetables and soy sauce.", price: 200, category: "Noodles", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.noodles },
  { id: "nood-2", name: "Schezwan Veg Noodles", description: "Spicy Schezwan noodles loaded with vegetables.", price: 220, category: "Noodles", isVeg: true, spiceLevel: "Hot", prepTime: 12, image: IMG.noodles },
  { id: "nood-3", name: "Chicken Hakka Noodles", description: "Classic chicken noodles with vegetables and soy.", price: 250, category: "Noodles", isVeg: false, spiceLevel: "Mild", prepTime: 12, image: IMG.noodles },
  { id: "nood-4", name: "Schezwan Chicken Noodles", description: "Fiery Schezwan noodles with chicken strips.", price: 270, category: "Noodles", isVeg: false, spiceLevel: "Hot", prepTime: 12, image: IMG.noodles },
  { id: "nood-5", name: "Prawns Hakka Noodles", description: "Hakka noodles with juicy prawns and vegetables.", price: 320, category: "Noodles", isVeg: false, spiceLevel: "Mild", prepTime: 12, image: IMG.noodles },
  { id: "nood-6", name: "Mixed Non-Veg Noodles", description: "Loaded with chicken, prawns, and egg.", price: 300, category: "Noodles", isVeg: false, spiceLevel: "Medium", prepTime: 12, image: IMG.noodles },

  // ═══════════════════════════════════════════════
  // INDIAN RICE (5 items)
  // ═══════════════════════════════════════════════
  { id: "irice-1", name: "Steamed Basmati Rice", description: "Fluffy steamed long-grain basmati rice.", price: 120, category: "Indian Rice", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.indianRice },
  { id: "irice-2", name: "Jeera Rice", description: "Basmati rice tempered with cumin seeds and ghee.", price: 150, category: "Indian Rice", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.indianRice },
  { id: "irice-3", name: "Ghee Rice", description: "Fragrant basmati rice cooked with pure ghee.", price: 160, category: "Indian Rice", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.indianRice },
  { id: "irice-4", name: "Curd Rice", description: "Cool tempered rice with yogurt, mustard, and curry leaves.", price: 140, category: "Indian Rice", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.indianRice },
  { id: "irice-5", name: "Lemon Rice", description: "Tangy lemon-tempered rice with peanuts and turmeric.", price: 150, category: "Indian Rice", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.indianRice },

  // ═══════════════════════════════════════════════
  // DAL (5 items)
  // ═══════════════════════════════════════════════
  { id: "dal-1", name: "Dal Tadka", description: "Yellow lentils tempered with cumin, garlic, and ghee.", price: 200, category: "Dal", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.dal },
  { id: "dal-2", name: "Dal Makhani", description: "Slow simmered black lentils with butter and a whisper of smoke.", price: 250, category: "Dal", isVeg: true, spiceLevel: "Mild", prepTime: 20, image: IMG.dal },
  { id: "dal-3", name: "Dal Fry", description: "Tempered toor dal with onions, tomatoes, and spices.", price: 200, category: "Dal", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.dal },
  { id: "dal-4", name: "Panchmel Dal", description: "Five lentil mix cooked in Rajasthani style.", price: 220, category: "Dal", isVeg: true, spiceLevel: "Medium", prepTime: 15, image: IMG.dal },
  { id: "dal-5", name: "Dal Palak", description: "Lentils cooked with fresh spinach and mild spices.", price: 210, category: "Dal", isVeg: true, spiceLevel: "Mild", prepTime: 15, image: IMG.dal },

  // ═══════════════════════════════════════════════
  // INDIAN BREADS (14 items)
  // ═══════════════════════════════════════════════
  { id: "bread-1", name: "Tandoori Roti", description: "Whole wheat bread baked in a clay oven.", price: 40, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.roti },
  { id: "bread-2", name: "Butter Roti", description: "Soft tandoori roti brushed with golden butter.", price: 50, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.roti },
  { id: "bread-3", name: "Plain Naan", description: "Classic oven-baked leavened bread.", price: 60, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.naan },
  { id: "bread-4", name: "Butter Naan", description: "Soft hand stretched bread brushed with golden butter.", price: 70, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.naan },
  { id: "bread-5", name: "Garlic Naan", description: "Naan topped with roasted garlic and herbs.", price: 80, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.naan },
  { id: "bread-6", name: "Cheese Naan", description: "Naan stuffed with melted mozzarella cheese.", price: 100, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.naan },
  { id: "bread-7", name: "Garlic Kulcha", description: "Oven baked bread with roasted garlic and herb aroma.", price: 80, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.naan },
  { id: "bread-8", name: "Paneer Kulcha", description: "Stuffed bread with spiced cottage cheese filling.", price: 100, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.naan },
  { id: "bread-9", name: "Aloo Paratha", description: "Whole wheat bread stuffed with spiced potato.", price: 90, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.roti },
  { id: "bread-10", name: "Lachha Paratha", description: "Layered whole wheat bread with butter.", price: 70, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.roti },
  { id: "bread-11", name: "Missi Roti", description: "Gram flour and wheat bread with spices.", price: 60, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.roti },
  { id: "bread-12", name: "Rumali Roti", description: "Paper-thin handkerchief bread, soft and delicate.", price: 50, category: "Indian Breads", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.roti },
  { id: "bread-13", name: "Keema Naan", description: "Naan stuffed with spiced minced meat.", price: 120, category: "Indian Breads", isVeg: false, spiceLevel: "Medium", prepTime: 12, image: IMG.naan },
  { id: "bread-14", name: "Chicken Tikka Naan", description: "Naan stuffed with chicken tikka filling.", price: 130, category: "Indian Breads", isVeg: false, spiceLevel: "Medium", prepTime: 12, image: IMG.naan },

  // ═══════════════════════════════════════════════
  // PIZZAS (10 items: 5 veg + 5 non-veg)
  // ═══════════════════════════════════════════════
  { id: "pizza-v1", name: "Margherita Pizza", description: "Classic tomato sauce, mozzarella, and fresh basil.", price: 250, category: "Pizzas", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.pizza },
  { id: "pizza-v2", name: "Farm Fresh Pizza", description: "Loaded with capsicum, onion, tomato, and corn.", price: 280, category: "Pizzas", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.pizza },
  { id: "pizza-v3", name: "Paneer Tikka Pizza", description: "Tandoori paneer, onion, and capsicum on cheesy base.", price: 320, category: "Pizzas", isVeg: true, spiceLevel: "Medium", prepTime: 18, image: IMG.pizza },
  { id: "pizza-v4", name: "Mushroom Truffle Pizza", description: "Sautéed mushrooms with truffle oil and mozzarella.", price: 350, category: "Pizzas", isVeg: true, spiceLevel: "Mild", prepTime: 18, image: IMG.pizza },
  { id: "pizza-v5", name: "Veg Supreme Pizza", description: "Everything veggie — olives, jalapenos, corn, peppers, onion.", price: 340, category: "Pizzas", isVeg: true, spiceLevel: "Medium", prepTime: 18, image: IMG.pizza },
  { id: "pizza-nv1", name: "Chicken Tikka Pizza", description: "Tandoori chicken tikka, onion, and green chili.", price: 350, category: "Pizzas", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.pizza },
  { id: "pizza-nv2", name: "BBQ Chicken Pizza", description: "Smoky BBQ chicken with onion rings and mozzarella.", price: 370, category: "Pizzas", isVeg: false, spiceLevel: "Mild", prepTime: 18, image: IMG.pizza },
  { id: "pizza-nv3", name: "Keema Pizza", description: "Spiced minced meat with onion and capsicum.", price: 360, category: "Pizzas", isVeg: false, spiceLevel: "Medium", prepTime: 18, image: IMG.pizza },
  { id: "pizza-nv4", name: "Chicken Supreme Pizza", description: "Loaded with chicken sausage, pepperoni, and chicken tikka.", price: 400, category: "Pizzas", isVeg: false, spiceLevel: "Medium", prepTime: 20, image: IMG.pizza },
  { id: "pizza-nv5", name: "Prawn Pizza", description: "Juicy prawns with garlic butter and mozzarella.", price: 420, category: "Pizzas", isVeg: false, spiceLevel: "Mild", prepTime: 20, image: IMG.pizza },

  // ═══════════════════════════════════════════════
  // PASTA (6 items: 3 sauces x 2 options)
  // ═══════════════════════════════════════════════
  { id: "pasta-1", name: "Penne Arrabbiata", description: "Penne pasta in a spicy tomato and garlic red sauce.", price: 250, category: "Pasta", isVeg: true, spiceLevel: "Hot", prepTime: 15, image: IMG.pasta },
  { id: "pasta-2", name: "Penne Alfredo", description: "Creamy white sauce pasta with herbs and parmesan.", price: 270, category: "Pasta", isVeg: true, spiceLevel: "Mild", prepTime: 15, image: IMG.pasta },
  { id: "pasta-3", name: "Penne in Pink Sauce", description: "Blend of tomato and cream sauce with Italian herbs.", price: 260, category: "Pasta", isVeg: true, spiceLevel: "Mild", prepTime: 15, image: IMG.pasta },
  { id: "pasta-4", name: "Chicken Penne Arrabbiata", description: "Spicy red sauce pasta with grilled chicken strips.", price: 300, category: "Pasta", isVeg: false, spiceLevel: "Hot", prepTime: 15, image: IMG.pasta },
  { id: "pasta-5", name: "Chicken Alfredo", description: "Creamy white sauce pasta with tender chicken pieces.", price: 320, category: "Pasta", isVeg: false, spiceLevel: "Mild", prepTime: 15, image: IMG.pasta },
  { id: "pasta-6", name: "Chicken Pink Sauce Pasta", description: "Grilled chicken in a rich tomato-cream sauce blend.", price: 310, category: "Pasta", isVeg: false, spiceLevel: "Mild", prepTime: 15, image: IMG.pasta },

  // ═══════════════════════════════════════════════
  // DESSERTS (7 items)
  // ═══════════════════════════════════════════════
  { id: "des-1", name: "Gulab Jamun (2 pcs)", description: "Warm soft milk dumplings soaked in rose-cardamom syrup.", price: 100, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.dessert },
  { id: "des-2", name: "Rasmalai (2 pcs)", description: "Soft cheese discs soaked in saffron milk and pistachio.", price: 130, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.dessert },
  { id: "des-3", name: "Gajar Ka Halwa", description: "Warm carrot pudding with nuts, khoya, and saffron.", price: 150, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.dessert },
  { id: "des-4", name: "Moong Dal Halwa", description: "Rich moong lentil pudding with ghee and dry fruits.", price: 160, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 12, image: IMG.dessert },
  { id: "des-5", name: "Brownie with Ice Cream", description: "Warm chocolate brownie served with vanilla ice cream.", price: 200, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.dessert },
  { id: "des-6", name: "Phirni", description: "Creamy rice pudding set in clay pots, chilled and garnished.", price: 120, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.dessert },
  { id: "des-7", name: "Shahi Tukda", description: "Fried bread slices soaked in rabdi with dry fruit topping.", price: 150, category: "Desserts", isVeg: true, spiceLevel: "Mild", prepTime: 10, image: IMG.dessert },

  // ═══════════════════════════════════════════════
  // ICE CREAM (6 items)
  // ═══════════════════════════════════════════════
  { id: "ice-1", name: "Vanilla Ice Cream", description: "Classic creamy vanilla bean ice cream.", price: 100, category: "Ice Cream", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.icecream },
  { id: "ice-2", name: "Chocolate Ice Cream", description: "Rich dark chocolate ice cream.", price: 100, category: "Ice Cream", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.icecream },
  { id: "ice-3", name: "Strawberry Ice Cream", description: "Fruity strawberry ice cream with real berry swirl.", price: 100, category: "Ice Cream", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.icecream },
  { id: "ice-4", name: "Butterscotch Ice Cream", description: "Caramel butterscotch ice cream with crunchy bits.", price: 110, category: "Ice Cream", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.icecream },
  { id: "ice-5", name: "Mango Ice Cream", description: "Seasonal Alphonso mango flavored ice cream.", price: 120, category: "Ice Cream", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.icecream },
  { id: "ice-6", name: "Kesar Pista Ice Cream", description: "Premium saffron and pistachio ice cream.", price: 130, category: "Ice Cream", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.icecream },

  // ═══════════════════════════════════════════════
  // BEVERAGES (15 items)
  // ═══════════════════════════════════════════════
  { id: "bev-1", name: "Masala Chai", description: "Traditional Indian tea brewed with aromatic spices.", price: 60, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.tea },
  { id: "bev-2", name: "Green Tea", description: "Light and refreshing green tea with antioxidants.", price: 80, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.tea },
  { id: "bev-3", name: "Black Coffee", description: "Strong brewed black coffee.", price: 80, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.tea },
  { id: "bev-4", name: "Cold Coffee", description: "Chilled blended coffee with cream and ice.", price: 150, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 8, image: IMG.shake },
  { id: "bev-5", name: "Sweet Lassi", description: "Chilled yogurt drink, creamy and refreshing.", price: 120, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.lassi },
  { id: "bev-6", name: "Mango Lassi", description: "Alphonso mango blended with fresh yogurt.", price: 150, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.lassi },
  { id: "bev-7", name: "Kesar Lassi", description: "Chilled yogurt drink kissed with saffron and rose.", price: 160, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.lassi },
  { id: "bev-8", name: "Fresh Lime Soda", description: "Refreshing lemon drink, sweet or salted.", price: 80, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.juice },
  { id: "bev-9", name: "Fresh Lime Water", description: "Classic nimbu pani, sweet and tangy.", price: 60, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.juice },
  { id: "bev-10", name: "Watermelon Juice", description: "Fresh pressed watermelon juice, chilled.", price: 120, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.juice },
  { id: "bev-11", name: "Mango Shake", description: "Thick mango milkshake with Alphonso pulp.", price: 180, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.shake },
  { id: "bev-12", name: "Butterscotch Shake", description: "Caramel butterscotch milkshake with ice cream.", price: 180, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.shake },
  { id: "bev-13", name: "Chocolate Shake", description: "Rich chocolate milkshake topped with whipped cream.", price: 180, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 5, image: IMG.shake },
  { id: "bev-14", name: "Soft Drinks", description: "Coca-Cola, Pepsi, Sprite, Fanta, or Thumbs Up.", price: 60, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 2, image: IMG.juice },
  { id: "bev-15", name: "Mineral Water (1L)", description: "Packaged drinking water, 1 litre bottle.", price: 40, category: "Beverages", isVeg: true, spiceLevel: "Mild", prepTime: 1, image: IMG.juice },
];

// All unique categories with sort order
export const menuCategories = [
  "Soups",
  "Salads",
  "Continental Starters",
  "Tandoori Starters",
  "Egg Items",
  "Platters",
  "Chinese Starters",
  "Indian Flavours",
  "Main Course Veg",
  "Main Course Non-Veg",
  "Biryani",
  "Biryani Family Pack",
  "Fried Rice",
  "Noodles",
  "Indian Rice",
  "Dal",
  "Indian Breads",
  "Pizzas",
  "Pasta",
  "Desserts",
  "Ice Cream",
  "Beverages",
] as const;

export type MenuCategoryName = (typeof menuCategories)[number];
