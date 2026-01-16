"use client";

import React from "react";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface DefaultPaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const DefaultPagination: React.FC<DefaultPaginationProps> = ({
  totalItems,
  itemsPerPage = 5,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page: number) => {
    if (page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <UIPagination>
      <PaginationContent className="flex gap-1">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageClick(currentPage - 1);
            }}
            className={`${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-100"
            }`}
          />
        </PaginationItem>

        {/* Sayfa Numaraları */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(page);
              }}
              className={`transition-colors ${
                page === currentPage
                  ? "bg-slate-900 text-black"
                  : "hover:bg-slate-600"
              }`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis (çok fazla sayfa varsa) */}
        {totalPages > 7 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePageClick(currentPage + 1);
            }}
            className={`${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-slate-100"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
};

export default DefaultPagination;
