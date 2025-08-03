'use client';
import { useState } from 'react';

export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

interface OptionSelectorProps {
    options: Option[];
    selectedValues: string[];
    onChange: (selectedValues: string[]) => void;
    type?: 'checkbox' | 'radio' | 'dropdown';
    title?: string;
    placeholder?: string;
    multiple?: boolean;
    className?: string;
    disabled?: boolean;
}

export default function OptionSelector({
    options,
    selectedValues,
    onChange,
    type = 'checkbox',
    title,
    placeholder = 'Select an option',
    multiple = true,
    className = '',
    disabled = false
}: OptionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCheckboxChange = (value: string) => {
        if (disabled) return;

        if (multiple) {
            const newValues = selectedValues.includes(value)
                ? selectedValues.filter(v => v !== value)
                : [...selectedValues, value];
            onChange(newValues);
        } else {
            onChange(selectedValues.includes(value) ? [] : [value]);
        }
    };

    const handleRadioChange = (value: string) => {
        if (disabled) return;
        onChange([value]);
    };

    const handleDropdownChange = (value: string) => {
        if (disabled) return;

        if (multiple) {
            const newValues = selectedValues.includes(value)
                ? selectedValues.filter(v => v !== value)
                : [...selectedValues, value];
            onChange(newValues);
        } else {
            onChange([value]);
            setIsOpen(false);
        }
    };

    const getSelectedLabel = () => {
        if (selectedValues.length === 0) return placeholder;
        if (selectedValues.length === 1) {
            const option = options.find(opt => opt.value === selectedValues[0]);
            return option?.label || selectedValues[0];
        }
        return `${selectedValues.length} selected`;
    };

    if (type === 'dropdown') {
        return (
            <div className={`relative ${className}`}>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={`w-full p-3 border border-gray-300 rounded-full bg-white ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        <span className='text-color-txt mr-4'>{getSelectedLabel()}</span>
                        <svg
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="#1D364D"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {/* --color-background-white */}
                    {isOpen && !disabled && (
                        <div className="absolute bg-white text-white top-15 left-1/2 transform -translate-x-1/2 z-10 w-full min-w-3xs rounded-md shadow-lg overflow-auto">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => !option.disabled && handleDropdownChange(option.value)}
                                    className={`p-3 cursor-pointer hover:shadow-lg flex items-center 
                                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {multiple && (
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(option.value)}
                                            onChange={() => { }}
                                            className="mr-3 hover:shadow-lg"
                                            disabled={option.disabled}
                                        />
                                    )}
                                    <span className={`text-black ${selectedValues.includes(option.value) ? 'text-selected-red' : ''}`}>{option.label}</span>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
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

    return (
        <div className={className}>
            <div className="space-y-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`flex items-center cursor-pointer ${option.disabled || disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <input
                            type={type}
                            name={type === 'radio' ? title : undefined}
                            value={option.value}
                            checked={selectedValues.includes(option.value)}
                            onChange={() =>
                                type === 'checkbox'
                                    ? handleCheckboxChange(option.value)
                                    : handleRadioChange(option.value)
                            }
                            disabled={option.disabled || disabled}
                            className={`mr-3 ${type === 'checkbox'
                                ? 'text-blue-600 focus:ring-blue-500 rounded'
                                : 'text-blue-600 focus:ring-blue-500'
                                }`}
                        />
                        <span className="text-[#1D364D] dark:text-white select-none]">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
