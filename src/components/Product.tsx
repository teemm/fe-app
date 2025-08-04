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
    name,
    price,
    image,
    description
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="relative">
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={240}
                    className="h-[220px] object-cover full-width"
                />
            </div>

            <div className="pr-4 pl-4">
                <div className="text-xl text-card-main mb-3 mt-5">{name}</div>

                {description && (
                    <span className="text-card-secondary text-md mb-10 line-clamp-2">
                        {description}
                    </span>
                )}
                <div className="flex items-center justify-center pt-10 pb-10 text-2xl font-semibold border-t border-gray-200">
                    ${price.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default Product;
