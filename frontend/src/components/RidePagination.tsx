import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface RidePaginationProps {
  total: number;
  limit: number;
  onOffsetChange: (offset: number) => void;
}

const RidePagination = ({
  total,
  limit,
  onOffsetChange,
}: RidePaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  useEffect(() => {
    onOffsetChange(offset);
  }, [offset, onOffsetChange]);

  const goToOffset = (nextOffset: number) => {
    setSearchParams({ offset: String(nextOffset) });
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?offset=${Math.max(offset - limit, 0)}`}
            aria-disabled={currentPage === 1}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1) goToOffset(offset - limit);
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`?offset=${(page - 1) * limit}`}
                isActive={page === currentPage}
                onClick={(event) => {
                  event.preventDefault();
                  goToOffset((page - 1) * limit);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={`?offset=${offset + limit}`}
            aria-disabled={currentPage === totalPages}
            onClick={(event) => {
              event.preventDefault();
              if (currentPage < totalPages) goToOffset(offset + limit);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default RidePagination;
