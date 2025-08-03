'use client';
import { useState, useEffect } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    title?: string;
    className?: string;
    disabled?: boolean;
}

export default function RangeSlider({
    min,
    max,
    value,
    onChange,
    title,
    className = '',
    disabled = false
}: RangeSliderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localValue, setLocalValue] = useState<[number, number]>(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleRangeChange = (type: 'min' | 'max', newValue: number) => {
        if (disabled) return;

        if (type === 'min') {
            const clampedMin = Math.max(min, Math.min(newValue, localValue[1]));
            const updatedValue: [number, number] = [clampedMin, localValue[1]];
            setLocalValue(updatedValue);
            onChange(updatedValue);
        } else {
            const clampedMax = Math.min(max, Math.max(newValue, localValue[0]));
            const updatedValue: [number, number] = [localValue[0], clampedMax];
            setLocalValue(updatedValue);
            onChange(updatedValue);
        }
    };

    const getDisplayLabel = () => {
        if (localValue[0] === min && localValue[1] === max) {
            return title || 'Price';
        }
        return `$${localValue[0]} - $${localValue[1]}`;
    };

    return (
        <div className={`relative ${className}`}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {title || 'Price Range'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getDisplayLabel()}
                        </div>
                    </div>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Dropdown Content */}
            {isOpen && !disabled && (
                <div className="absolute z-10 w-full mt-1 p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                    <div className="space-y-4">
                        {/* Range Display */}
                        <div className="text-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                ${localValue[0]} - ${localValue[1]}
                            </span>
                        </div>

                        {/* Dual Range Slider */}
                        <div className="relative">
                            {/* Track Background */}
                            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-lg relative">
                                {/* Active Range */}
                                <div
                                    className="absolute h-2 bg-blue-600 rounded-lg"
                                    style={{
                                        left: `${((localValue[0] - min) / (max - min)) * 100}%`,
                                        width: `${((localValue[1] - localValue[0]) / (max - min)) * 100}%`
                                    }}
                                />
                            </div>

                            {/* Min Range Input */}
                            <input
                                type="range"
                                min={min}
                                max={max}
                                value={localValue[0]}
                                onChange={(e) => handleRangeChange('min', parseInt(e.target.value))}
                                className="absolute top-0 w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                            />

                            {/* Max Range Input */}
                            <input
                                type="range"
                                min={min}
                                max={max}
                                value={localValue[1]}
                                onChange={(e) => handleRangeChange('max', parseInt(e.target.value))}
                                className="absolute top-0 w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                            />
                        </div>

                        {/* Input Fields */}
                        <div className="flex items-center space-x-2">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={localValue[0]}
                                    onChange={(e) => handleRangeChange('min', parseInt(e.target.value) || min)}
                                    min={min}
                                    max={localValue[1]}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Min"
                                />
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">–</span>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={localValue[1]}
                                    onChange={(e) => handleRangeChange('max', parseInt(e.target.value) || max)}
                                    min={localValue[0]}
                                    max={max}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={() => onChange([min, max])}
                            className="w-full py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
