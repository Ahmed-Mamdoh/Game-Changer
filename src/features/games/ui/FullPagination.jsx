import { useLocation, useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetNumberOfResults } from "@/features/games/hooks/useGetNumberOfResults";
import { LIMIT } from "@/constants/constant";

const NUM_PAGE_BUTTONS = 5;
const middleNumber = Math.floor(NUM_PAGE_BUTTONS / 2);
function FullPagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const currentPage = Number(searchParams.get("page")) || 1;
  const { data, isLoading } = useGetNumberOfResults(location.pathname);
  if (isLoading) return null;
  if (data.count === 0) return null;
  const numberOfPages = Math.ceil(data?.count / LIMIT);
  return (
    <div className="flex items-center justify-center select-none">
      <div className="bg-base-200 mb-16 w-1/2 rounded-md py-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="hover:bg-primary hover:text-primary-content cursor-pointer font-extrabold transition-colors"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  if (currentPage > 1) {
                    newParams.set("page", currentPage - 1);
                    setSearchParams(newParams);
                  }
                }}
              />
            </PaginationItem>

            {Array.from({ length: NUM_PAGE_BUTTONS }, (_, i) => {
              // subtract the middleNumber to make the current page button on the middle
              if (
                currentPage + i - middleNumber <= 0 ||
                currentPage + i - middleNumber > numberOfPages
              )
                return;
              else
                return (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      className={`${
                        i + currentPage - middleNumber === currentPage
                          ? "bg-primary hover:bg-primary text-primary-content font-extrabold"
                          : "hover:bg-primary hover:text-primary-content cursor-pointer font-extrabold"
                      }`}
                      onClick={() => {
                        if (i === middleNumber) return;
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set("page", i + currentPage - middleNumber);
                        setSearchParams(newParams);
                      }}
                    >
                      {i + currentPage - middleNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
            })}

            {currentPage + middleNumber <= numberOfPages ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : null}
            <PaginationItem>
              <PaginationNext
                className="hover:bg-primary hover:text-primary-content cursor-pointer font-extrabold"
                onClick={() => {
                  if (currentPage === numberOfPages) return;
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", currentPage + 1);
                  setSearchParams(newParams);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default FullPagination;
