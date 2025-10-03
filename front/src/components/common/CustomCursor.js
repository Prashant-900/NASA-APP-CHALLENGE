import React, { useEffect, useState } from 'react';
import '../styles/cursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [trails, setTrails] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const addTrail = (x, y) => {
      const trail = { x, y, id: Date.now() };
      setTrails(prevTrails => [...prevTrails, trail]);
      setTimeout(() => {
        setTrails(prevTrails => prevTrails.filter(t => t.id !== trail.id));
      }, 300);
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      if (e.movementX > 5 || e.movementY > 5) {
        addTrail(e.clientX, e.clientY);
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onHover = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], input, select, textarea');
      setHovered(!!interactive);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onHover);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onHover);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className={`custom-cursor ${clicked ? 'clicked' : ''} ${hovered ? 'hover' : ''}`}
        style={{
          transform: `translate3d(${position.x - 10}px, ${position.y - 10}px, 0)`,
        }}
      />

      {/* Cursor dot */}
      <div
        className="cursor-dot"
        style={{
          transform: `translate3d(${position.x - 2}px, ${position.y - 2}px, 0)`,
        }}
      />

      {/* Trails */}
      {trails.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            transform: `translate3d(${trail.x - 1}px, ${trail.y - 1}px, 0)`,
            opacity: 0.5,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;