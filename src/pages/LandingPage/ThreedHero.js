import React from 'react';
import Slider from 'react-slick';

const ThreeDTShirt = () => {
  const images = [
    'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%201.png?alt=media&token=483abd31-dea2-482a-8c78-d72adbaceb37',
    'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%202.png?alt=media&token=b2fc8b91-0b93-4061-9ece-2f64a276f2d5',
    'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%203.png?alt=media&token=76841fe9-b958-4fec-a2bb-5d9d9ec5afa6',
    'https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/homepage%20video%2FLanding%20page%20c%204.png?alt=media&token=b05e8ded-bf24-4594-b28c-d7c9f0fd8772',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500, // Adjust speed for a smoother transition
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Autoplay interval set to 3 seconds
  };

  return (
    <div className="mt-2 md:mt-5">
      <Slider {...settings}>
        {images.map((item, index) => (
          <div key={index} className="image-container">
            <img
              src={item}
              alt={`T-Shirt ${index + 1}`}
              className="zoomable-image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ThreeDTShirt;
