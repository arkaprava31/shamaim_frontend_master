import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Autoplay, Navigation } from 'swiper/modules';

const Allgenre = () => {

  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const genres = [
    {
      name: "Sports",
      link: "genre/sports",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-05.png?alt=media&token=57b38e92-027b-4095-947c-eadce04bee83",
    },
    {
      name: "Anime",
      link: "genre/anime",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-01.png?alt=media&token=fed75c5a-3dfe-4ede-a593-43e3ba4a9d2c",
    },
    {
      name: "Music & Band",
      link: "genre/music-&-band",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-04.png?alt=media&token=e28d6832-2d1b-4556-9c7f-0688ec5caf7c",
    },
    {
      name: "Super Hero",
      link: "genre/superhero",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-06.png?alt=media&token=9bb79d83-fb76-4da1-8e50-33d21020c38e",
    },
    {
      name: "Bangla O Bangali",
      link: "genre/bangla-o-bangali",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-07.png?alt=media&token=3aa1a2f6-ec5c-4545-ae89-fdfe860eee77",
    },
    {
      name: "Movies & Series",
      link: "genre/movies-&-series",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-08.png?alt=media&token=fdff3778-d604-417f-b332-dd093d0febcb",
    },
    {
      name: "Drip & Doodle",
      link: "genre/drip-&-doodle",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-02.png?alt=media&token=86b50ad1-486c-491a-8cd8-cb849617f240",
    },
    {
      name: "Abstract",
      link: "genre/abstract",
      img: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Gonerbox%2FGenre%20Box-03.png?alt=media&token=6ad14df7-2e81-4d71-8c29-967953c7e4d6",
    },
  ];

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
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 40 },
          1024: { slidesPerView: 3, spaceBetween: 10 },
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="mySwiper"
      >
        {genres.map((genre, index) => (
          <SwiperSlide key={index}>
            <Link to={genre.link}>
              <div className="relative w-full h-[13rem] lg:h-[30rem] overflow-hidden rounded-lg">

                {!loadedImages[index] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <p className="text-gray-500">{genre.name}</p>
                  </div>
                )}

                <img
                  src={genre.img}
                  alt={genre.name}
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  className={`w-full h-full object-cover transform transition-all duration-500 hover:scale-50 
                    ${loadedImages[index] ? "opacity-100" : "opacity-0"}`}
                />

              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Allgenre;