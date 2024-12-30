import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const ImageCarousel = () => {
  return (
    <div className="w-full h-[800px]">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        showStatus={false}
        interval={3000}
        transitionTime={500}
      >
        <div className="h-[800px]">
          <img src="/images/bikeRide1.jpeg" alt="Bike Ride Image" className="object-cover h-full w-full" />
          <p className="legend">CMV Bike Ride 2023</p>
        </div>
        <div className="h-[800px]">
          <img src="/images/newYear1.jpeg" alt="New Year Image" className="object-cover h-full w-full" />
          <p className="legend">CMV New Year 2023</p>
        </div>
        <div className="h-[800px]">
          <img src="/images/bikeRide2.jpeg" alt="Bike Ride Image" className="object-cover h-full w-full" />
          <p className="legend">CMV Bike Ride 2023</p>
        </div>
        <div className="h-[800px]">
          <img src="/images/trekImg.jpeg" alt="Trek Image" className="object-cover h-full w-full" />
          <p className="legend">CMV Trek 2023</p>
        </div>
        <div className="h-[800px]">
          <img src="/images/newYear2.jpeg" alt="New Year Image" className="object-cover h-full w-full" />
          <p className="legend">CMV New Year 2023</p>
        </div>
        <div className="h-[800px]">
          <img src="/images/bikeRide3.jpeg" alt="Bike Ride Image" className="object-cover h-full w-full" />
          <p className="legend">CMV Bike Ride 2022</p>
        </div>
      </Carousel>
    </div>
  );
};
export default ImageCarousel;
