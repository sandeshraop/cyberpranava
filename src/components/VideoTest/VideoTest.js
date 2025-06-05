import React, { useRef, useEffect, useState } from 'react';

const VideoTest = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);
  const videoPath = `${process.env.PUBLIC_URL}/videos/intro.mp4`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setStatus('Video can play');
      video.play().catch(err => {
        setStatus('Auto-play failed, trying muted...');
        video.muted = true;
        video.play().catch(e => {
          setError(`Playback failed: ${e.message}`);
        });
      });
    };

    const handleError = () => {
      setError(`Video error: ${video.error?.message || 'Unknown error'}`);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Set video source programmatically
    video.src = videoPath;

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoPath]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      maxWidth: '80%',
      textAlign: 'center'
    }}>
      <h3>Video Test</h3>
      <div>Status: {status}</div>
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      <div style={{ margin: '20px 0' }}>
        <video
          ref={videoRef}
          controls
          style={{ maxWidth: '100%', maxHeight: '60vh' }}
        >
          <source src={videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div>Video path: {videoPath}</div>
      <div>Full URL: {window.location.origin + videoPath}</div>
      <button 
        onClick={() => window.open(window.location.origin + videoPath, '_blank')}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          background: '#4A00E0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Open Video in New Tab
      </button>
    </div>
  );
};

export default VideoTest;
