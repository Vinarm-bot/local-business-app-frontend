import { useEffect, useState } from 'react';

const videos = [
  '/hero-video-1.mp4',
  '/hero-video-2.mp4',
  '/hero-video-3.mp4',
  '/hero-video-4.mp4'
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videos.length);
    }, 8000); // switch video every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      zIndex: 0
    }}>
      {videos.map((src, index) => (
        <video
          key={src}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out'
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay so text stays readable */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.65))'
      }} />
    </div>
  );
}

export default HeroSlideshow;