import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GameItem from "./../ui/GameItem";
import { useState, useEffect } from "react";

function GameDetailsCarousel({ sectionName, data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    const onReInit = () => {
      setSnapCount(carouselApi.scrollSnapList().length);
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    onReInit();

    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onReInit);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onReInit);
    };
  }, [carouselApi]);

  return (
    <>
      <div className="mx-auto flex w-9/10 items-start justify-start pt-12 pb-3">
        <h2 className="text-center">{sectionName}</h2>
      </div>
      <div className="mx-auto w-9/10 py-2 md:py-10">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
          }}
          setApi={setCarouselApi}
        >
          <CarouselContent className="md:py-2">
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/2  cursor-grab select-none active:cursor-grabbing sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <GameItem game={item} className="place-self-center" />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            variant="default"
            className="border-stroke-subtle bg-bg-surface hover:bg-bg-surface/60 hidden h-12 w-12 translate-x-6 cursor-pointer rounded-full border-1 backdrop-blur-xs md:flex"
          />
          <CarouselNext
            variant="default"
            className="border-stroke-subtle bg-bg-surface hover:bg-bg-surface/60 hidden h-12 w-12 -translate-x-6 cursor-pointer rounded-full border-1 backdrop-blur-xs md:flex"
          />
        </Carousel>

        {/* Dot indicators - responsive */}
        <div className="mt-4 flex items-center justify-center gap-2 ">
          {Array.from({ length: snapCount }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-text-dim scale-125"
                  : "bg-text-dim/30"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default GameDetailsCarousel;
