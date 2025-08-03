'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { OptionSelector } from '@/components';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';

interface SelectibleOption {
    option_type: string;
    option_name: string;
    option: (string | number)[];
}

interface Product {
    id: string;
    product_name: string;
    brand: string;
    price: number;
    description: string;
    category: string;
    stock_quantity: number;
    release_date: string;
    selectible_option: SelectibleOption | null;
}

const fetchProduct = async (productId: string): Promise<Product> => {
    const response = await fetch(`http://localhost:3010/products/${productId}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
    }

    return response.json();
};

export default function ProductDetailPage() {
    const { addToCart } = useCart();
    const params = useParams();
    const productId = params.id as string;
    const [selectedOption, setSelectedOption] = useState<string>('');

    const {
        data: product,
        isLoading,
        error,
        isError
    } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-gray-600 dark:text-gray-300">
                            Loading product...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {error?.message === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {error?.message || 'Unable to load product details'}
                        </p>
                        <Link
                            href="/products"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (product.stock_quantity === 0) return;

        // Check if option selection is required but not selected
        if (product.selectible_option && !selectedOption) {
            alert(`Please select a ${product.selectible_option.option_name.toLowerCase()} before adding to cart`);
            return;
        }

        addToCart({
            id: product.id,
            name: product.product_name,
            price: product.price,
            image: getPlaceholderImage(product.category),
            selectedOptions: selectedOption ? [selectedOption] : undefined,
        });

        console.log(`Added ${product.product_name} to cart with option:`, selectedOption);
    };

    const getPlaceholderImage = (category: string) => {
        const imageMap: { [key: string]: string } = {
            'Shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
            'Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
            'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        };
        return imageMap[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link
                        href="/products"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                    >
                        ← Back to Products
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img
                                src={getPlaceholderImage(product.category)}
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {product.product_name}
                            </h1>

                            {/* Brand */}
                            <p className="text-gray-600 dark:text-gray-400">
                                {product.brand}
                            </p>

                            {/* Price */}
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${product.price.toFixed(2)}
                            </div>

                            {/* Description */}
                            <div className="text-gray-600 dark:text-gray-300">
                                {product.description}
                            </div>

                            {/* Product Options */}
                            {product.selectible_option && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select {product.selectible_option.option_name}:
                                    </label>
                                    <select
                                        value={selectedOption}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">
                                            Choose {product.selectible_option.option_name.toLowerCase()}...
                                        </option>
                                        {product.selectible_option.option.map((optionValue, index) => (
                                            <option key={index} value={optionValue.toString()}>
                                                {optionValue}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0}
                                className={`w-full py-3 px-6 rounded-md font-medium text-white transition-colors ${product.stock_quantity === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to cart'}
                            </button>

                            {/* Stock Status */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Available Quantity:
                                </span>
                                <span className={`text-sm font-medium ${product.stock_quantity === 0
                                    ? 'text-red-500'
                                    : product.stock_quantity < 5
                                        ? 'text-yellow-500'
                                        : 'text-green-500'
                                    }`}>
                                    {product.stock_quantity === 0 ? 'Out of stock' : product.stock_quantity}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}