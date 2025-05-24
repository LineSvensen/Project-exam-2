import React from "react";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8 flex-wrap gap-2 text-sm font-color">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 button-descret disabled:opacity-50"
      >
        &lt;
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-8 h-8 button-descret"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="w-8 h-8 text-center button-descret">…</span>
          )}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 button-descret ${
            page === currentPage
              ? "bg-gray-400 font-bold text-lg button-descret"
              : ""
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="w-8 h-8 text-center button-descret">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 button-descret"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 button-descret disabled:opacity-50 "
      >
        &gt;
      </button>
    </div>
  );
}
