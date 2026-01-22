import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Logic to show limited page numbers if there are too many pages
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg border-gray-300"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 p-0 rounded-lg text-sm font-medium transition-all ${currentPage === page
                  ? 'bg-[#0f7396] hover:bg-[#0b5c7a] text-white border-[#0f7396]'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                }`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg border-gray-300"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
