'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, Grid3x3, List } from 'lucide-react';
import { menuCategories, type MenuItemData, type MenuCategoryData } from '@/lib/menuData';
import { CategoryIcon } from '@/components/CategoryIcon';
import { VariantSelector } from '@/components/VariantSelector';
import { DietaryToggle } from '@/components/DietaryToggle';
import { useMenuStore } from '@/store/useMenuStore';
import { useCart } from '@/store/useCart';

type FilterMode = 'all' | 'veg' | 'non-veg';
type ViewMode = 'grid' | 'list';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');