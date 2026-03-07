export default function HeroVideo() {
  return (
    <div className="w-full">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full object-cover"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/video_homepage%2FHomepage%20animation%201080p.mp4?alt=media&token=40d51cce-e4b3-4b68-9877-4dfd260a448b"
          type="video/mp4"
        />
      </video>
    </div>
  );
}