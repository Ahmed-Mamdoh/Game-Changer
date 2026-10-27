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
import useScreenWidth from "@/hooks/useScreenWidth";

function FullPagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const screenWidth = useScreenWidth();

  const NUM_PAGE_BUTTONS = screenWidth > 768 ? 10 : 5;
  const middleNumber = Math.floor(NUM_PAGE_BUTTONS / 2);
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data, isLoading } = useGetNumberOfResults(location.pathname);
  if (isLoading) return null;
  if (data.count === 0) return null;
  const numberOfPages = Math.ceil(data?.count / LIMIT);
  return (
    <div className="flex items-center justify-center px-4 pb-16 select-none">
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="text-text-dim hover:text-text-main cursor-pointer rounded-md bg-transparent hover:bg-white/[0.06]"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  if (currentPage > 1) {
                    newParams.set("page", currentPage - 1);
                    setSearchParams(newParams);
                    window.scrollTo({ top: 0 });
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
                          ? "bg-action text-on-action hover:bg-action tabular rounded-md font-semibold"
                          : "text-text-dim hover:text-text-main tabular cursor-pointer rounded-md bg-transparent hover:bg-white/[0.06]"
                      }`}
                      aria-current={i === middleNumber ? "page" : undefined}
                      onClick={() => {
                        if (i === middleNumber) return;
                        window.scrollTo({ top: 0 });
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
                className="text-text-dim hover:text-text-main cursor-pointer rounded-md bg-transparent hover:bg-white/[0.06]"
                onClick={() => {
                  if (currentPage === numberOfPages) return;
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", currentPage + 1);
                  setSearchParams(newParams);
                  window.scrollTo({ top: 0 });
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
