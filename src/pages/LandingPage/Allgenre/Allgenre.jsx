import React, { useState } from 'react';
// Import Swiper React components
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import Swiper modules
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

const Allgenre = () => {

  const HoverComponent = () => {
    const [isHovered, setIsHovered] = useState(false);
  
    let hoverTimeout;
  
    const handleMouseEnter = () => {
      setIsHovered(true);
      hoverTimeout = setTimeout(() => {
        setIsHovered(false);
      }, 1000); // 1000 milliseconds = 1 second
    };
  
    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout);
      setIsHovered(false);
    };

  }

  return (
    <div className="all-genre py-8">
      <div className="heading-section text-center mb-8">
        <h1 className="text-3xl font-bold">Most Popular Style</h1>
      </div>

      <Swiper
        slidesPerView={2}
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="mySwiper"
      >




        <SwiperSlide>
          <Link to="genre/Sports" >

            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-05.png?alt=media&token=57b38e92-027b-4095-947c-eadce04bee83"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
          
             />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Anime">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-01.png?alt=media&token=fed75c5a-3dfe-4ede-a593-43e3ba4a9d2c"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Music & Band">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-04.png?alt=media&token=e28d6832-2d1b-4556-9c7f-0688ec5caf7c"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Superhero">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-06.png?alt=media&token=9bb79d83-fb76-4da1-8e50-33d21020c38e"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Bangla O Bangali">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-07.png?alt=media&token=3aa1a2f6-ec5c-4545-ae89-fdfe860eee77"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Movies & Series">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-08.png?alt=media&token=fdff3778-d604-417f-b332-dd093d0febcb"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Drip & Doodle">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-02.png?alt=media&token=86b50ad1-486c-491a-8cd8-cb849617f240"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="genre/Abstract">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-03.png?alt=media&token=6ad14df7-2e81-4d71-8c29-967953c7e4d6"
              alt="Genre 1"
              className="w-full h-auto transform transition-transform duration-100 hover:scale-50"
            />
          </Link>
        </SwiperSlide>
      
      </Swiper>
    </div>
  );
}

export default Allgenre;
