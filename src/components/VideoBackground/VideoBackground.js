import React, { useRef, useEffect, useState } from 'react';
import './VideoBackground.css';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set attributes before setting source
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    
    // Set source
    const source = document.createElement('source');
    source.src = `${process.env.PUBLIC_URL}/videos/intro.mp4`;
    source.type = 'video/mp4';
    
    // Clear any existing sources
    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }
    
    video.appendChild(source);
    
    const handleLoadedData = () => {
      console.log('Video loaded');
      setIsLoaded(true);
      video.play().catch(error => {
        console.error('Autoplay failed:', error);
      });
    };
    
    video.addEventListener('loadeddata', handleLoadedData);
    
    // For iOS devices
    const handlePlay = () => {
      video.play().catch(e => console.log('Play attempt failed:', e));
    };
    
    // Try to play when user interacts with the page
    const handleUserInteraction = () => {
      handlePlay();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    // Initial play attempt
    handlePlay();
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <div className="video-background">
      <video
        ref={videoRef}
        className="video"
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
      >
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};

export default VideoBackground;
