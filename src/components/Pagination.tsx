'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

const Pagination = ({ currentPage, totalPages, onPageChange, maxVisiblePages = 7 }: PaginationProps) => {
    const getVisiblePages = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const halfVisible = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - halfVisible);
        const end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex w-full items-center justify-end space-x-2 mt-8">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-black border border-gray-300 ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : ''
                    }`}
            >
                Previous
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg text-sm border border-gray-300 font-medium transition-colors text-black ${currentPage === page
                        ? 'bg-pg-active'
                        : 'bg-white'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-black border border-gray-300 ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : ''
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
