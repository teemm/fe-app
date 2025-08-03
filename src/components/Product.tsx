'use client';

import React from 'react';
import Image from 'next/image';

interface ProductProps {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
    onAddToCart?: (productId: string) => void;
}

const Product: React.FC<ProductProps> = ({
    id,
    name,
    price,
    image,
    description,
    category,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
            <div className="relative">
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                />
                {category && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {category}
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{name}</h3>

                {description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Product;
