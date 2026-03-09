import { useState } from "react";

export default function HeroVideo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full">

      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setLoaded(true)}
        className="w-full object-cover"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/video_homepage%2FHomepage%20animation%201080p.mp4?alt=media&token=40d51cce-e4b3-4b68-9877-4dfd260a448b"
          type="video/mp4"
        />
      </video>

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white overflow-hidden">
          
          <div className="absolute inset-0 bg-gray-200 animate-pulse h-[20rem]"></div>

          <div className="relative text-center">
            <p className="text-2xl tracking-widest text-purple-600 animate-pulse font-bold">
              SHAMAIM
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Loading experience
            </p>
          </div>

        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}