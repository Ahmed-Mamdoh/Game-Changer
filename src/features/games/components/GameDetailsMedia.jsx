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
        <div className=" mx-auto w-9/10 pt-32 pb-3">
          <div
            id="Media"
            className="font-heading flex items-start justify-start"
          >
            <h2 className="text-5xl">Media</h2>
          </div>

          <div className="mx-auto rounded-sm py-6">
            <Carousel
              className="to-obsidian-deep border-obsidian-border
              mx-auto w-[85%] rounded-2xl border-2 bg-gradient-to-br from-gray-400/15 from-5% to-10% py-4 pr-4"
            >
              <CarouselContent className="mx-auto">
                {screenshots?.map((screenshot) => {
                  return (
                    <CarouselItem key={screenshot.id}>
                      <img
                        src={screenshot?.url
                          ?.replace("t_thumb", "t_1080p_2x")
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
                className="border-obsidian-border bg-obsidian-muted/90 hover:bg-obsidian-muted/60 h-22 w-12 translate-x-22 cursor-pointer rounded-full border-1 backdrop-blur-xs"
              />
              <CarouselNext
                variant="default"
                className="border-obsidian-border bg-obsidian-muted/90 hover:bg-obsidian-muted/60 h-22 w-12 -translate-x-22 cursor-pointer rounded-full border-1 backdrop-blur-xs"
              />
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}

export default GameDetailsMedia;
