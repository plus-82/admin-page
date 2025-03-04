import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Don't render if there's only 1 page or less
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than max, show all pages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);
      
      // Calculate start and end of page range
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(start + 2, totalPages - 1);
      
      // Adjust start if end is too close to totalPages
      if (end === totalPages - 1) {
        start = Math.max(1, end - 2);
      }
      
      // Add ellipsis after first page if needed
      if (start > 1) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add page range
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 2) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }
      
      // Always include last page if not already included
      if (end < totalPages - 1) {
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const paginationClass = ['pagination', className].filter(Boolean).join(' ');

  return (
    <div className={paginationClass}>
      <button 
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      
      <div className="pagination-numbers">
        {pageNumbers.map((pageNumber, index) => (
          pageNumber < 0 ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={pageNumber}
              className={`pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
              disabled={pageNumber === currentPage}
            >
              {pageNumber + 1}
            </button>
          )
        ))}
      </div>
      
      <button 
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;