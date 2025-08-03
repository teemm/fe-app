'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function Header() {
    const { items, removeFromCart, clearCart, getTotalPrice, getTotalItems, updateQuantity } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(id);
        } else {
            updateQuantity(id, newQuantity);
        }
    };

    return (
        <header className="bg-white dark:transparent shadow-sm relative">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-900 dark:text-white">
                        Flat Rock Tech
                    </Link>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={toggleCart}
                                className="relative p-2"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                                    />
                                </svg>
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown */}
                            {isCartOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Shopping Cart
                                        </h3>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="p-4 text-center">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Your cart is empty
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="max-h-64 overflow-y-auto">
                                                {items.map((item) => (
                                                    <div key={`${item.id}-${JSON.stringify(item.selectedOptions)}`} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    ${item.price.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                    className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[20px] text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                    className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    onClick={() => removeFromCart(item.id)}
                                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                                >
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2.5 4a.5.5 0 01.5-.5h1.5a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Total: ${getTotalPrice().toFixed(2)}
                                                    </span>
                                                </div>
                                                <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 mb-2">
                                                    Continue To Checkout
                                                </button>
                                                <button
                                                    onClick={clearCart}
                                                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                                >
                                                    Clear Cart
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop to close cart when clicking outside */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCartOpen(false)}
                />
            )}
        </header>
    );
}