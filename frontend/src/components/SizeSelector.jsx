import React, { useState } from 'react';

/**
 * Size selector component for products that have size options
 * @param {Object} props
 * @param {Array} props.sizes - Available sizes for the product
 * @param {Function} props.onSizeSelect - Callback when size is selected
 * @param {String} props.selectedSize - Currently selected size
 */
const SizeSelector = ({ sizes, onSizeSelect, selectedSize }) => {
  // If no sizes are available, don't render anything
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700">Size</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`px-3 py-1 border rounded-md text-sm font-medium
              ${selectedSize === size 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
