import React, { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const speedRef = useRef(2);
  const targetSpeedRef = useRef(2);

  const PARTICLE_NUM = 500;
  const PARTICLE_BASE_RADIUS = 0.5;
  const FL = 500;
  const DEFAULT_SPEED = 2;
  const BOOST_SPEED = 15;

  class Particle {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.pastZ = 0;
    }
  }

  const randomizeParticle = (p, canvasWidth, canvasHeight) => {
    p.x = Math.random() * canvasWidth;
    p.y = Math.random() * canvasHeight;
    p.z = Math.random() * 1500 + 500;
    return p;
  };

  const loop = (canvas, context) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const centerX = canvasWidth * 0.5;
    const centerY = canvasHeight * 0.5;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.01;

    const halfPi = Math.PI * 0.5;

    context.beginPath();
    context.fillStyle = 'rgb(255, 255, 255)';

    for (let i = 0; i < PARTICLE_NUM; i++) {
      const p = particlesRef.current[i];

      p.pastZ = p.z;
      p.z -= speedRef.current;

      if (p.z <= 0) {
        randomizeParticle(p, canvasWidth, canvasHeight);
        continue;
      }

      const cx = centerX - (mouseRef.current.x - centerX) * 1.25;
      const cy = centerY - (mouseRef.current.y - centerY) * 1.25;

      const rx = p.x - cx;
      const ry = p.y - cy;

      const f = FL / p.z;
      const x = cx + rx * f;
      const y = cy + ry * f;
      const r = PARTICLE_BASE_RADIUS * f;

      const pf = FL / p.pastZ;
      const px = cx + rx * pf;
      const py = cy + ry * pf;
      const pr = PARTICLE_BASE_RADIUS * pf;

      const a = Math.atan2(py - y, px - x);
      const a1 = a + halfPi;
      const a2 = a - halfPi;

      context.moveTo(px + pr * Math.cos(a1), py + pr * Math.sin(a1));
      context.arc(px, py, pr, a1, a2, true);
      context.lineTo(x + r * Math.cos(a2), y + r * Math.sin(a2));
      context.arc(x, y, r, a2, a1, true);
      context.closePath();
    }
    context.fill();

    animationRef.current = requestAnimationFrame(() => loop(canvas, context));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current.x = canvas.width * 0.5;
      mouseRef.current.y = canvas.height * 0.5;
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      targetSpeedRef.current = BOOST_SPEED;
    };

    const handleMouseUp = () => {
      targetSpeedRef.current = DEFAULT_SPEED;
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_NUM; i++) {
      particlesRef.current[i] = randomizeParticle(new Particle(), canvas.width, canvas.height);
      particlesRef.current[i].z -= 500 * Math.random();
    }

    loop(canvas, context);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default StarfieldBackground;