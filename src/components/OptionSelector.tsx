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
                {title && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {title}
                    </label>
                )}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        <span>{getSelectedLabel()}</span>
                        <svg
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isOpen && !disabled && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => !option.disabled && handleDropdownChange(option.value)}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                                        } ${selectedValues.includes(option.value) ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                                >
                                    {multiple && (
                                        <input
                                            type="checkbox"
                                            checked={selectedValues.includes(option.value)}
                                            onChange={() => { }}
                                            className="mr-3 text-blue-600 focus:ring-blue-500"
                                            disabled={option.disabled}
                                        />
                                    )}
                                    <span className="text-gray-900 dark:text-white">{option.label}</span>
                                    {selectedValues.includes(option.value) && !multiple && (
                                        <svg className="ml-auto w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
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
            {title && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {title}
                </label>
            )}
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
                        <span className="text-gray-900 dark:text-white select-none">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
