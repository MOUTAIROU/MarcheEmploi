import React from "react";

type PaginationProps = {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    total: number;
    limit: number;
};

export default function Pagination({ page, setPage, total, limit }: PaginationProps) {

    const totalPages = Math.ceil(total / limit);

    const nextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    return (
        <div className="pagination">

            <button onClick={prevPage} disabled={page === 1}>
                Précédent
            </button>

            <span>
                Page {page} / {totalPages}
            </span>

            <button onClick={nextPage} disabled={page === totalPages}>
                Suivant
            </button>

        </div>
    );
}