import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import YoutubeEmbed from "@/ui/YoutubeEmbed";

function GameDetailsMedia({ data }) {
  const { screenshots, videos } = data[0];
  return (
    <>
      {(screenshots?.length > 0 || videos?.length > 0) && (
        <>
          <div
            id="Media"
            className="font-heading flex items-center justify-center pt-12 pb-3 text-4xl md:text-6xl"
          >
            <h2 className="text-center">Media</h2>
          </div>
          <div className="bg-base-100 container mx-auto rounded-sm py-12">
            <Carousel className="mx-auto w-11/12 md:w-9/12">
              <CarouselContent>
                {screenshots?.map((screenshot) => {
                  return (
                    <CarouselItem key={screenshot.id}>
                      <img
                        src={screenshot?.url
                          ?.replace("t_thumb", "t_720p")
                          ?.replace("jpg", "webp")}
                        alt=""
                        className="cursor-grab rounded-2xl select-none active:cursor-grabbing"
                      />
                    </CarouselItem>
                  );
                })}
                {videos?.map((video) => {
                  return (
                    <CarouselItem key={video.id}>
                      <YoutubeEmbed videoId={video.video_id} />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious
                variant="default"
                className="hidden h-12 w-12 translate-x-6 hover:scale-110 md:flex"
              />
              <CarouselNext
                variant="default"
                className="hidden h-12 w-12 -translate-x-6 hover:scale-110 md:flex"
              />
            </Carousel>
          </div>
        </>
      )}
    </>
  );
}

export default GameDetailsMedia;
