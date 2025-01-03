import { useState } from 'react';
import { Tag, ArrowDownUp, Star, DollarSign, Truck } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  priceRange: string;
  sortBy: string;
  inStock: boolean;
  freeShipping: boolean;
  minRating: number;
  dateRange: string;
}

const Filters = ({ onFilterChange }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: 'all',
    sortBy: 'popular',
    inStock: false,
    freeShipping: false,
    minRating: 0,
    dateRange: '',
  });

  const categories = [
    { value: 'Electronics', icon: '💻' },
    { value: 'Clothing', icon: '👕' },
    { value: 'Shoes', icon: '👟' },
    { value: 'Accessories', icon: '👜' },
    { value: 'Home', icon: '🏠' },
    { value: 'Sports', icon: '⚽' },
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-50', label: 'Under $50' },
    { value: '50-100', label: '$50 to $100' },
    { value: '100-200', label: '$100 to $200' },
    { value: 'over-200', label: 'Over $200' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: Star },
    { value: 'price-low', label: 'Price: Low to High', icon: ArrowDownUp },
    { value: 'price-high', label: 'Price: High to Low', icon: ArrowDownUp },
    { value: 'rating', label: 'Highest Rated', icon: Star },
  ];

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (range: string) => {
    const newFilters = { ...filters, priceRange: range };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sort: string) => {
    const newFilters = { ...filters, sortBy: sort };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleToggleChange = (field: 'inStock' | 'freeShipping') => {
    const newFilters = { ...filters, [field]: !filters[field] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center mb-3">
          <Tag className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium text-black/90 dark:text-white/90">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ value, icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200 ${
                filters.categories.includes(value)
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-light-100 dark:bg-dark-100 text-black/80 dark:text-white/80 hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              <span className="text-base">{icon}</span>
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-3">
          <DollarSign className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium text-black/90 dark:text-white/90">Price Range</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handlePriceRangeChange(range.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                filters.priceRange === range.value
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-light-100 dark:bg-dark-100 text-black/80 dark:text-white/80 hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-3">
          <ArrowDownUp className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium text-black/90 dark:text-white/90">Sort By</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200 ${
                  filters.sortBy === option.value
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-light-100 dark:bg-dark-100 text-black/80 dark:text-white/80 hover:bg-light-200 dark:hover:bg-dark-200'
                }`}
              >
                <Icon size={14} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-3">
          <Star className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium text-black/90 dark:text-white/90">Minimum Rating</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200 ${
                filters.minRating === rating
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-light-100 dark:bg-dark-100 text-black/80 dark:text-white/80 hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              {rating === 0 ? (
                'Any Rating'
              ) : (
                <>
                  {rating}+ <Star size={14} className="fill-current" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center mb-1">
          <Truck className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium text-black/90 dark:text-white/90">Other Filters</h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleToggleChange('inStock')}
            className={`w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-all duration-200 ${
              filters.inStock
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-light-100 dark:bg-dark-100 text-black/80 dark:text-white/80 hover:bg-light-200 dark:hover:bg-dark-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={() => {}}
                className={`w-4 h-4 rounded border-2 transition-colors ${
                  filters.inStock 
                    ? 'border-white bg-white/20' 
                    : 'border-black/20 dark:border-white/20'
                }`}
              />
              In Stock Only
            </span>
          </button>

          <button
            onClick={() => handleToggleChange('freeShipping')}
            className={`w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-all duration-200 ${
              filters.freeShipping
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-light-100 dark:bg-dark-100 text-black/80 dark:text-white/80 hover:bg-light-200 dark:hover:bg-dark-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.freeShipping}
                onChange={() => {}}
                className={`w-4 h-4 rounded border-2 transition-colors ${
                  filters.freeShipping 
                    ? 'border-white bg-white/20' 
                    : 'border-black/20 dark:border-white/20'
                }`}
              />
              Free Shipping
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
