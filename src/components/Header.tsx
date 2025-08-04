'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const { items, removeFromCart, getTotalPrice, getTotalItems, updateQuantity } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleQuantityChange = (uniqueKey: string, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(uniqueKey);
        } else {
            updateQuantity(uniqueKey, newQuantity);
        }
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <header className="bg-white dark:transparent shadow-sm relative">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold italic text-blue-900 dark:text-white">
                        Flat Rock Tech
                    </Link>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={toggleCart}
                                className="relative p-2"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-600 dark:text-black"
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
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">
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
                                                {items.map((item) => {
                                                    const uniqueKey = `${item.id}`;
                                                    return (
                                                        <div key={uniqueKey} className="p-4 border-b last:border-b-0">
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
                                                                        onClick={() => handleQuantityChange(uniqueKey, item.quantity - 1)}
                                                                        className="w-6 h-6 rounded-full bg-secondary-gray flex items-center justify-center text-black hover:bg-gray-300 dark:hover:bg-gray-500"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-sm font-medium text-black min-w-[20px] text-center">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleQuantityChange(uniqueKey, item.quantity + 1)}
                                                                        className="w-6 h-6 rounded-full bg-secondary-gray flex items-center justify-center text-black hover:bg-gray-300 dark:hover:bg-gray-500"
                                                                    >
                                                                        +
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeFromCart(uniqueKey)}
                                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                                    >
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M9.5 14.5L9.5 11.5" stroke="#222222" strokeLinecap="round" />
                                                                            <path d="M14.5 14.5L14.5 11.5" stroke="#222222" strokeLinecap="round" />
                                                                            <path d="M3 6.5H21V6.5C19.5955 6.5 18.8933 6.5 18.3889 6.83706C18.1705 6.98298 17.983 7.17048 17.8371 7.38886C17.5 7.89331 17.5 8.59554 17.5 10V15.5C17.5 17.3856 17.5 18.3284 16.9142 18.9142C16.3284 19.5 15.3856 19.5 13.5 19.5H10.5C8.61438 19.5 7.67157 19.5 7.08579 18.9142C6.5 18.3284 6.5 17.3856 6.5 15.5V10C6.5 8.59554 6.5 7.89331 6.16294 7.38886C6.01702 7.17048 5.82952 6.98298 5.61114 6.83706C5.10669 6.5 4.40446 6.5 3 6.5V6.5Z" stroke="#222222" strokeLinecap="round" />
                                                                            <path d="M9.5 3.50024C9.5 3.50024 10 2.5 12 2.5C14 2.5 14.5 3.5 14.5 3.5" stroke="#222222" strokeLinecap="round" />
                                                                        </svg>


                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="p-2 border-t border border-gray-200 rounded-b-lg">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-lg font-semibold text-black">
                                                        Total: ${getTotalPrice().toFixed(2)}
                                                    </span>
                                                </div>
                                                <button className="w-full bg-black text-white py-2 px-4 rounded-md bg-main-green"
                                                    onClick={handleCheckout}>
                                                    Continue To Checkout
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