import React, { useEffect, useRef } from 'react';
import '../../styles/cursor.css';

const ShootingStarCursor = () => {
  const wrapperRef = useRef(null);
  const starRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const star = starRef.current;

    const updateCursor = (e) => {
      if (!star) return;
      const { clientX, clientY } = e;
      star.style.left = `${clientX}px`;
      star.style.top = `${clientY}px`;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastTimeRef.current;
      
      if (timeDiff > 16) { // Limit trail creation to ~60fps
        const dx = clientX - lastPosRef.current.x;
        const dy = clientY - lastPosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Only create trail segments for significant movements
          const angle = Math.atan2(dy, dx);
          const trail = document.createElement('div');
          trail.className = 'trail-segment';
          trail.style.width = `${distance}px`;
          trail.style.left = `${lastPosRef.current.x}px`;
          trail.style.top = `${lastPosRef.current.y}px`;
          trail.style.transform = `rotate(${angle}rad)`;
          
          wrapper.appendChild(trail);
          setTimeout(() => wrapper.removeChild(trail), 100);
          
          lastTimeRef.current = currentTime;
          lastPosRef.current = { x: clientX, y: clientY };
        }
      }
    };

    const handleScroll = () => {
      while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="cursor-wrapper">
      <div ref={starRef} className="star-core" />
    </div>
  );
};

export default ShootingStarCursor;