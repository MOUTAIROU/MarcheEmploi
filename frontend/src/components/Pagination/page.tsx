// components/Pagination.tsx
import Link from "next/link";
import "./style.css";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage?: number;
  basePath?: string; // ex: "/annonces"
}

export default function Pagination({
  totalItems,
  currentPage,
  itemsPerPage = 12,
  basePath = "",
}: PaginationProps) {


  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <ul className="pagination">
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;

        return (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <Link
              href={`${basePath}/recherche/page/${page}`}
              className="page-link"
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
