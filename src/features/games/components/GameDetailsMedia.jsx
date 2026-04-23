import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import YoutubeEmbed from "@/ui/YoutubeEmbed";
import { formatIGDBImage } from "@/utils/igdbImage";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function GameDetailsMedia({ data }) {
  const { screenshots, videos } = data[0];
  return (
    <>
      {(screenshots?.length > 0 || videos?.length > 0) && (
        <div className="mx-auto w-full pt-16 pb-2 md:w-9/10 md:pt-32 md:pb-3">
          <div
            id="Media"
            className="flex items-start justify-start px-4 md:px-0"
          >
            <h2>Media</h2>
          </div>

          <div className="mx-auto py-4 md:py-6">
            <Carousel
              className="border-stroke-subtle bg-bg-card
              mx-auto w-[95%] rounded-xl border-1 
              py-0 pr-0 md:w-[80%] md:py-4 md:pr-4"
            >
              <CarouselContent className="mx-auto">
                {screenshots?.map((screenshot) => {
                  return (
                    <CarouselItem key={screenshot.id} className="px-1 md:pl-4">
                      <div className="aspect-[4/3] rounded-xl md:aspect-[16/9]">
                        <img
                          src={formatIGDBImage(screenshot?.url, "t_1080p_2x")}
                          alt=""
                          className="h-full w-full cursor-grab rounded-xl object-cover select-none active:cursor-grabbing"
                        />
                      </div>
                    </CarouselItem>
                  );
                })}
                {videos?.map((video) => {
                  return (
                    <CarouselItem
                      key={video.id}
                      className="flex flex-col items-center gap-3 px-1 pb-4 md:pb-0 md:pl-4"
                    >
                      <YoutubeEmbed videoId={video.video_id} />

                      <div className="flex items-center gap-x-2 md:hidden">
                        <FaChevronLeft className="text-text-dim text-sm" />
                        <p className="text-text-secondary text-sm select-none">
                          Swap From Here
                        </p>
                        <FaChevronRight className="text-text-dim text-sm" />
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious
                variant="default"
                className="border-stroke-subtle bg-bg-card hover:bg-bg-card/60 hidden h-22 w-12 translate-x-22 cursor-pointer rounded-full border-1 backdrop-blur-xs md:flex"
              />
              <CarouselNext
                variant="default"
                className="border-stroke-subtle bg-bg-card hover:bg-bg-card/60 hidden h-22 w-12 -translate-x-22 cursor-pointer rounded-full border-1 backdrop-blur-xs md:flex"
              />
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}

export default GameDetailsMedia;
