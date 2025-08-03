'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, Pagination, OptionSelector, RangeSlider } from '@/components';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Link from 'next/link';

interface ApiProduct {
    id: string;
    product_name: string;
    price: number;
    description: string;
    category: string;
    brand: string;
    stock_quantity: number;
    release_date: string;
    selectible_option: any;
}

interface ProductData {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    brand: string;
    release_date: string;
}

interface Brand {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

const fetchProducts = async (): Promise<ApiProduct[]> => {
    const response = await fetch('http://localhost:3010/products');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

const fetchBrands = async (): Promise<Brand[]> => {
    const response = await fetch('http://localhost:3010/brands');
    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }
    return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch('http://localhost:3010/categories');
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

export default function ProductsPage() {
    const { addToCart } = useCart();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSort, setSelectedSort] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Get min and max prices from all products for slider bounds
    const minPrice = 0;
    const maxPrice = 500;
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
    const productsPerPage = 8; // Show 8 products per page

    const { data: apiProducts, isLoading, error, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: brands, isLoading: brandsLoading } = useQuery({
        queryKey: ['brands'],
        queryFn: fetchBrands,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const getPlaceholderImage = (category: string) => {
        const imageMap: { [key: string]: string } = {
            'Shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=230&h=240&fit=crop',
            'Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=230&h=240&fit=crop',
            'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=230&h=240&fit=crop',
        };
        return imageMap[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=230&h=240&fit=crop';
    };

    // Transform API products to UI format
    const allProducts: ProductData[] = apiProducts?.map((product) => ({
        id: product.id,
        name: product.product_name,
        price: product.price,
        image: getPlaceholderImage(product.category),
        description: product.description,
        category: product.category,
        brand: product.brand,
        release_date: product.release_date,
    })) || [];

    // Filter products by selected brands, price range, and category
    const filteredProducts = allProducts.filter(product => {
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        return brandMatch && priceMatch && categoryMatch;
    });

    // Sort filtered products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (selectedSort.length === 0) return 0;

        const sortType = selectedSort[0];

        switch (sortType) {
            case 'release_date_desc':
                return new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime();
            case 'release_date_asc':
                return new Date(a.release_date || '').getTime() - new Date(b.release_date || '').getTime();
            case 'price_desc':
                return b.price - a.price;
            case 'price_asc':
                return a.price - b.price;
            default:
                return 0;
        }
    });

    const handleAddToCart = (productId: string) => {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            console.log(`Added product ${productId} to cart`);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBrandChange = (selectedValues: string[]) => {
        setSelectedBrands(selectedValues);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleSortChange = (selectedValues: string[]) => {
        setSelectedSort(selectedValues);
        setCurrentPage(1); // Reset to first page when sort changes
    };

    const handlePriceRangeChange = (newRange: [number, number]) => {
        setPriceRange(newRange);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Calculate pagination based on sorted products
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    // Prepare brand options for OptionSelector
    const brandOptions = brands?.map(brand => ({
        value: brand.name,
        label: brand.name
    })) || [];

    // Sort options
    const sortOptions = [
        { value: 'release_date_desc', label: 'Release Date: Desc' },
        { value: 'release_date_asc', label: 'Release Date: Asc' },
        { value: 'price_desc', label: 'Price: Desc' },
        { value: 'price_asc', label: 'Price: Asc' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-gray-600 dark:text-gray-300">
                            Loading products...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="text-xl text-red-600 dark:text-red-400 mb-4">
                            Error: {error instanceof Error ? error.message : 'An error occurred'}
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Our Products
                    </h1>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0 p-2 bg-secondary-gray rounded">
                        <label className="flex items-center p-2 bg-white rounded text-black">
                            <input
                                type="radio"
                                name="category"
                                value="All"
                                checked={selectedCategory === 'All'}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="mr-2 hidden"
                            />
                            <span className="text-black">All</span>
                        </label>
                        {categories?.map((category) => (
                            <label key={category.id} className="flex items-center bg-white p-2 rounded">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.name}
                                    checked={selectedCategory === category.name}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="mr-2 hidden"
                                    disabled={categoriesLoading}
                                />
                                <span className="text-black">{category.name}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <OptionSelector
                            title="Brand"
                            options={brandOptions}
                            selectedValues={selectedBrands}
                            onChange={handleBrandChange}
                            type="dropdown"
                            multiple={true}
                            placeholder="Brand"
                            className="w-full"
                            disabled={brandsLoading}
                        />
                        <RangeSlider
                            title="Price"
                            min={minPrice}
                            max={maxPrice}
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            step={1}
                            className="w-full"
                        />
                        <OptionSelector
                            title="Sort by"
                            options={sortOptions}
                            selectedValues={selectedSort}
                            onChange={handleSortChange}
                            type="dropdown"
                            multiple={false}
                            placeholder="Sort by"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                        <Link key={product.id} href={`/${product.id}`}>
                            <Product
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                description={product.description}
                                category={product.category}
                                onAddToCart={handleAddToCart}
                            />
                        </Link>
                    ))}
                </div>

                {/* Show message when no products match filter */}
                {sortedProducts.length === 0 && (selectedBrands.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice || selectedCategory !== 'All') && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">
                            No products found for the current filters.
                        </div>
                        <button
                            onClick={() => {
                                setSelectedBrands([]);
                                setPriceRange([minPrice, maxPrice]);
                                setSelectedCategory('All');
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Pagination Component */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}