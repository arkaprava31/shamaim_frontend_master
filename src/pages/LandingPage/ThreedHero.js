import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const ThreeDTShirt = () => {
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

  const images = [
    {
      name: 'Banner_1',
      url: 'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%201.png?alt=media&token=483abd31-dea2-482a-8c78-d72adbaceb37',
      link: '/banner/b1',
    },
    {
      name: 'Banner_2',
      url: 'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%202.png?alt=media&token=b2fc8b91-0b93-4061-9ece-2f64a276f2d5',
      link: '/banner/b2',
    },
    {
      name: 'Banner_3',
      url: 'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%203.png?alt=media&token=76841fe9-b958-4fec-a2bb-5d9d9ec5afa6',
      link: '/banner/b3',
    },
    {
      name: 'Banner_4',
      url: 'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%204.png?alt=media&token=b05e8ded-bf24-4594-b28c-d7c9f0fd8772',
      link: '/banner/b4',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Slider {...settings}>
        {images.map((item, index) => (
          <Link key={index} to={item.link}>
            <div className="relative w-full h-[12rem] lg:h-[37.5rem] overflow-hidden">

              {!loadedImages[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <p className="text-gray-500">{item.name}</p>
                </div>
              )}

              <img
                src={item.url}
                alt={item.name}
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
                className={`zoomable-image w-full h-full object-cover transition-opacity duration-500 ${loadedImages[index] ? "opacity-100" : "opacity-0"
                  }`}
              />

            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default ThreeDTShirt;