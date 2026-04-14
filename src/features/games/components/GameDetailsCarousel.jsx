import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GameItem from "./../ui/GameItem";
import { useState, useEffect } from "react";
import useScreenWidth from "./../../../hooks/useScreenWidth";

function GameDetailsCarousel({ sectionName, data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);
  const screenWidth = useScreenWidth();

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  return (
    <>
      <div className="font-heading mx-auto flex w-9/10 items-start justify-start pt-12 pb-3 text-4xl md:text-6xl">
        <h2 className="text-center text-3xl md:text-5xl">{sectionName}</h2>
      </div>
      <div className="mx-auto w-9/10 rounded-sm py-2 md:py-10">
        <Carousel
          opts={{
            loop: false,
          }}
          setApi={setCarouselApi}
        >
          <CarouselContent className="ml-0! w-full md:py-2">
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className="xs:basis-1/2 basis-1/1 cursor-grab pl-0 select-none active:cursor-grabbing sm:basis-1/3 xl:basis-1/5"
              >
                <GameItem game={item} className="place-self-center" />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            variant="default"
            className="border-obsidian-border bg-obsidian-muted/90 hover:bg-obsidian-muted/60 hidden h-12 w-12 translate-x-6 cursor-pointer rounded-full border-1 backdrop-blur-xs md:flex"
          />
          <CarouselNext
            variant="default"
            className="border-obsidian-border bg-obsidian-muted/90 hover:bg-obsidian-muted/60 hidden h-12 w-12 -translate-x-6 cursor-pointer rounded-full border-1 backdrop-blur-xs md:flex"
          />
        </Carousel>

        {/* Dot indicators - mobile only */}
        <div className="mt-4 flex items-center justify-center gap-2 ">
          {data.map((_, index) => {
            if (
              screenWidth > 640 &&
              screenWidth < 1280 &&
              index >= data.length - 2
            ) {
              return null;
            }
            if (screenWidth > 1280 && index >= data.length - 4) {
              return null;
            }

            return (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "scale-125 bg-white" : "bg-white/30"
                }`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default GameDetailsCarousel;
