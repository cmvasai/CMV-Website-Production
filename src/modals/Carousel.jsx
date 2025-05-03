import Carousel from "../utils/CarouselCode/Carousel";

const ImageCarousel = ({ carouselItems }) => {
  return (
    <div className="w-full mt-0 p-0 bg-white dark:bg-gray-900">
      <Carousel items={carouselItems} autoplay={true} autoplayDelay={3000} />
    </div>
  );
};

export default ImageCarousel;

