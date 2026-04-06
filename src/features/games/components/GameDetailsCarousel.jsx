import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GameItem from "./../ui/GameItem";

function GameDetailsCarousel({ sectionName, data }) {
  return (
    <>
      <div className="font-heading mx-auto flex w-9/10 items-start justify-start pt-12 pb-3 text-4xl md:text-6xl">
        <h2 className="text-center text-5xl">{sectionName}</h2>
      </div>
      <div className=" container mx-auto w-9/10 rounded-sm py-10">
        <Carousel
          opts={{
            loop: false,
          }}
        >
          <CarouselContent className="w-lg sm:w-full md:py-2">
            {data.map((item) => (
              <CarouselItem className="basis-1/2 cursor-grab select-none active:cursor-grabbing md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
                <GameItem game={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="default"
            className="border-obsidian-border bg-obsidian-muted/90 hover:bg-obsidian-muted/60 h-12 w-12 translate-x-6 cursor-pointer rounded-full border-1 backdrop-blur-xs"
          />
          <CarouselNext
            variant="default"
            className="border-obsidian-border bg-obsidian-muted/90 hover:bg-obsidian-muted/60 h-12 w-12 -translate-x-6 cursor-pointer rounded-full border-1 backdrop-blur-xs"
          />
        </Carousel>
      </div>
    </>
  );
}

export default GameDetailsCarousel;
