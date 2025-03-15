import Carousel from "./CarouselCode/Carousel";

const ImageCarousel = () => {
  return (
    <div className="w-full mt-0 p-0 bg-white dark:bg-gray-900"> {/* 🔥 Removes margin/padding above */}
      <Carousel autoplay={true} autoplayDelay={3000} />
    </div>
  );
};

export default ImageCarousel;

