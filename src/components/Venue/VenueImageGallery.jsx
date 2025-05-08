import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageGallery({
  media = [],
  altFallback = "Venue image",
}) {
  if (!media.length) return <p>No images available</p>;

  return (
    <div className="w-full max-w-4xl mx-auto aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] overflow-hidden rounded-lg">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full custom-swiper"
      >
        {media.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img.url}
              alt={img.alt || altFallback}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
