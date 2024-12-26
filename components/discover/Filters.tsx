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
}

const Filters = ({ onFilterChange }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: 'all',
    sortBy: 'popular',
    inStock: false,
    freeShipping: false,
    minRating: 0,
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
    <div className="space-y-4">
      <div>
        <div className="flex items-center mb-2">
          <Tag className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map(({ value, icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-200 ${
                filters.categories.includes(value)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-light-100 dark:bg-dark-100 text-black dark:text-white hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              <span>{icon}</span>
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <DollarSign className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium">Price</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handlePriceRangeChange(range.value)}
              className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
                filters.priceRange === range.value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-light-100 dark:bg-dark-100 text-black dark:text-white hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <ArrowDownUp className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium">Sort By</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-200 ${
                  filters.sortBy === option.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-light-100 dark:bg-dark-100 text-black dark:text-white hover:bg-light-200 dark:hover:bg-dark-200'
                }`}
              >
                <Icon size={12} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Star className="mr-2 text-emerald-500" size={16} />
          <h3 className="font-medium">Rating</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-200 ${
                filters.minRating === rating
                  ? 'bg-emerald-500 text-white'
                  : 'bg-light-100 dark:bg-dark-100 text-black dark:text-white hover:bg-light-200 dark:hover:bg-dark-200'
              }`}
            >
              {rating === 0 ? (
                'Any'
              ) : (
                <>
                  {rating}+ <Star size={12} className="fill-current" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleToggleChange('inStock')}
          className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-200 ${
            filters.inStock
              ? 'bg-emerald-500 text-white'
              : 'bg-light-100 dark:bg-dark-100 text-black dark:text-white hover:bg-light-200 dark:hover:bg-dark-200'
          }`}
        >
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => {}}
            className="w-3 h-3 rounded border-gray-300"
          />
          In Stock
        </button>

        <button
          onClick={() => handleToggleChange('freeShipping')}
          className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all duration-200 ${
            filters.freeShipping
              ? 'bg-emerald-500 text-white'
              : 'bg-light-100 dark:bg-dark-100 text-black dark:text-white hover:bg-light-200 dark:hover:bg-dark-200'
          }`}
        >
          <input
            type="checkbox"
            checked={filters.freeShipping}
            onChange={() => {}}
            className="w-3 h-3 rounded border-gray-300"
          />
          Free Shipping
        </button>
      </div>
    </div>
  );
};

export default Filters;
