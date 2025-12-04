import React from 'react';

const AboutUs = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Assets%2FWallpaper-02.png?alt=media&token=4b0bc833-d761-4bf5-815f-0a619c1414d9"
        className="h-screen w-full"
        alt="About Us Background"
      />
      <h1 className="absolute text-white text-center font-bold text-xl top-10 w-full h-20 z-10">About Us</h1>
      <p className="absolute text-white text-center text-lg mt-4 top-16 h-20 z-20 w-full max-w-xl mx-auto">
        Shamaim Lifestyle is a dynamic unisex hybrid fashion brand that celebrates diversity and uniqueness. With a perfect
        blend of online and offline experiences, we bring fashion to your fingertips while fostering a sense of community and
        personal connection. Our brand is based in Kolkata, India, also known as the "city of joy," where we draw inspiration
        from its vibrant culture and rich heritage.
      </p>
      <p className="absolute text-white text-center text-lg mt-20 md:mt-0 h-20 z-5 w-full max-w-xl mx-auto">
        At Shamaim Lifestyle, we believe that fashion is not just about following trends; it is about embracing your own
        uniqueness and expressing yourself authentically. Our brand's tagline, "Embrace your Uniqueness with shamaim," encapsulates
        this ethos perfectly. We want to empower individuals to embrace their individuality, break free from stereotypes, and
        confidently express themselves through their personal style.
      </p>
    </div>
  );
};

export default AboutUs;
