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
    <div className="flex items-center justify-center pb-12 select-none">
      <div className="border-stroke-subtle bg-bg-card mb-16 w-fit rounded-full border-1 px-6 py-4 md:px-12 ">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="hover:bg-pulse-primary/50  cursor-pointer rounded-full font-bold transition-colors"
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
                          ? " hover:bg-pulse-primary/50  bg-pulse-primary/50 shadow-pulse-primary/60 rounded-full font-bold shadow-[0_0_6px_1px]"
                          : "hover:bg-pulse-primary/50 cursor-pointer rounded-full font-bold"
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
                className="hover:bg-pulse-primary/50 cursor-pointer rounded-full font-bold transition-colors"
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
