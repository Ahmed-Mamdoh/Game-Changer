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
      <div className="font-heading flex items-center justify-center pt-12 pb-3 text-4xl md:text-6xl">
        <h2 className="text-center">{sectionName}</h2>
      </div>
      <div className="bg-base-100 container mx-auto rounded-sm py-10">
        <Carousel
          opts={{
            loop: false,
          }}
        >
          <CarouselContent className="w-lg sm:w-full md:py-2">
            {data.map((item) => (
              <CarouselItem className="basis-1/2 cursor-grab select-none active:cursor-grabbing md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <GameItem game={item} />
              </CarouselItem>
            ))}
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
  );
}

export default GameDetailsCarousel;
