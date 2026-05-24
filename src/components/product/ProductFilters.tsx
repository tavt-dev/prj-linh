import React from 'react';
import { Brand, Level } from '../../types';

interface ProductFiltersProps {
  categorySlug?: string | null;
  selectedBrands: Brand[];
  setSelectedBrands: (brands: Brand[]) => void;
  selectedLevels: Level[];
  setSelectedLevels: (levels: Level[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedWeights: string[];
  setSelectedWeights: (weights: string[]) => void;
  selectedHeadSizes: string[];
  setSelectedHeadSizes: (sizes: string[]) => void;
  selectedBalances: string[];
  setSelectedBalances: (balances: string[]) => void;
}

const BRANDS: Brand[] = ['Wilson', 'Babolat', 'Head', 'Yonex', 'Nike', 'Adidas', 'Dunlop'];
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const WEIGHTS = [
  { id: 'under-260', label: 'Siêu nhẹ (Dưới 260g)' },
  { id: '260-280', label: 'Nhẹ (260g - 280g)' },
  { id: '281-299', label: 'Trung bình (281g - 299g)' },
  { id: 'over-300', label: 'Nặng (Từ 300g trở lên)' },
];
const HEAD_SIZES = [
  { id: 'midsize', label: 'Midsize (Dưới 95 sq.in)' },
  { id: 'midplus', label: 'Midplus (95 - 105 sq.in)' },
  { id: 'oversize', label: 'Oversize (Trên 105 sq.in)' },
];
const BALANCES = [
  { id: 'head-light', label: 'Nhẹ đầu (Dưới 320mm)' },
  { id: 'even', label: 'Cân bằng (320mm)' },
  { id: 'head-heavy', label: 'Nặng đầu (Trên 320mm)' },
];

export function ProductFilters({
  categorySlug,
  selectedBrands,
  setSelectedBrands,
  selectedLevels,
  setSelectedLevels,
  priceRange,
  setPriceRange,
  selectedWeights,
  setSelectedWeights,
  selectedHeadSizes,
  setSelectedHeadSizes,
  selectedBalances,
  setSelectedBalances,
}: ProductFiltersProps) {
  const handleBrandChange = (brand: Brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleLevelChange = (level: Level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const handleCheckboxChange = (
    id: string,
    selectedList: string[],
    setSelectedList: (list: string[]) => void
  ) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter((item) => item !== id));
    } else {
      setSelectedList([...selectedList, id]);
    }
  };

  const isRacket = !['apparel', 'tennis-balls', 'shuttlecocks'].includes(categorySlug || '');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Thương hiệu</h3>
        <div className="space-y-3">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border border-zinc-300 rounded-md checked:bg-zinc-900 checked:border-zinc-900 transition-colors cursor-pointer"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <svg
                  className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {isRacket && (
        <>
          <div className="w-full h-px bg-zinc-200" />

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Trình độ</h3>
            <div className="space-y-3">
              {LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border border-zinc-300 rounded-md checked:bg-zinc-900 checked:border-zinc-900 transition-colors cursor-pointer"
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleLevelChange(level)}
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">
                    {level === 'Beginner' ? 'Người mới chơi' : level === 'Intermediate' ? 'Trung bình' : 'Nâng cao'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-zinc-200" />

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Trọng lượng</h3>
            <div className="space-y-3">
              {WEIGHTS.map((weight) => (
                <label key={weight.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border border-zinc-300 rounded-md checked:bg-zinc-900 checked:border-zinc-900 transition-colors cursor-pointer"
                  checked={selectedWeights.includes(weight.id)}
                  onChange={() => handleCheckboxChange(weight.id, selectedWeights, setSelectedWeights)}
                />
                <svg
                  className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{weight.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-200" />

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Kích thước mặt vợt</h3>
        <div className="space-y-3">
          {HEAD_SIZES.map((size) => (
            <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border border-zinc-300 rounded-md checked:bg-zinc-900 checked:border-zinc-900 transition-colors cursor-pointer"
                  checked={selectedHeadSizes.includes(size.id)}
                  onChange={() => handleCheckboxChange(size.id, selectedHeadSizes, setSelectedHeadSizes)}
                />
                <svg
                  className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{size.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-zinc-200" />

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Điểm cân bằng</h3>
        <div className="space-y-3">
          {BALANCES.map((balance) => (
            <label key={balance.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border border-zinc-300 rounded-md checked:bg-zinc-900 checked:border-zinc-900 transition-colors cursor-pointer"
                  checked={selectedBalances.includes(balance.id)}
                  onChange={() => handleCheckboxChange(balance.id, selectedBalances, setSelectedBalances)}
                />
                <svg
                  className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{balance.label}</span>
            </label>
          ))}
        </div>
      </div>
      </>
      )}

      <div className="w-full h-px bg-zinc-200" />

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Mức giá</h3>
        <div className="space-y-3">
          {[
            { id: 'under-1m', label: 'Dưới 1.000.000đ', range: [0, 1000000] },
            { id: '1m-2m', label: '1.000.000đ - 2.000.000đ', range: [1000000, 2000000] },
            { id: '2m-3m', label: '2.000.000đ - 3.000.000đ', range: [2000000, 3000000] },
            { id: '3m-4m', label: '3.000.000đ - 4.000.000đ', range: [3000000, 4000000] },
            { id: 'over-4m', label: 'Trên 4.000.000đ', range: [4000000, 100000000] },
          ].map((price) => {
            const isSelected = priceRange[0] === price.range[0] && priceRange[1] === price.range[1];
            return (
              <label key={price.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    name="price-range"
                    className="peer appearance-none w-5 h-5 border border-zinc-300 rounded-full checked:border-zinc-900 transition-colors cursor-pointer"
                    checked={isSelected}
                    onChange={() => setPriceRange(price.range as [number, number])}
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-zinc-900 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{price.label}</span>
              </label>
            );
          })}
          <button 
            onClick={() => setPriceRange([0, 100000000])}
            className="text-xs text-zinc-500 hover:text-zinc-900 underline mt-2 block"
          >
            Bỏ chọn mức giá
          </button>
        </div>
      </div>
    </div>
  );
}
