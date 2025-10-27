import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export function AnimatedBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    const particleCount = Math.floor((dimensions.width * dimensions.height) / 15000);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      time += 0.01;

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
        }
        if (particle.y < 0 || particle.y > dimensions.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(dimensions.height, particle.y));
        }

        // Pulse effect
        particle.pulsePhase += 0.02;
        const pulse = Math.sin(particle.pulsePhase) * 0.2 + 0.8;

        // Draw connections to nearby particles
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            // Calculate connection strength based on distance
            const strength = 1 - distance / maxDistance;
            
            // Dynamic connection appearance/disappearance
            const connectionPhase = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
            const finalStrength = strength * connectionPhase;

            if (finalStrength > 0.1) {
              // Gradient line from blue to light blue
              const gradient = ctx.createLinearGradient(
                particle.x,
                particle.y,
                otherParticle.x,
                otherParticle.y
              );
              gradient.addColorStop(0, `rgba(30, 144, 255, ${finalStrength * 0.3})`);
              gradient.addColorStop(0.5, `rgba(100, 180, 255, ${finalStrength * 0.4})`);
              gradient.addColorStop(1, `rgba(30, 144, 255, ${finalStrength * 0.3})`);

              ctx.strokeStyle = gradient;
              ctx.lineWidth = finalStrength * 1.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });

        // Draw particle with glow effect
        const glowSize = particle.radius * 3 * pulse;
        
        // Outer glow
        const outerGlow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          glowSize
        );
        outerGlow.addColorStop(0, `rgba(30, 144, 255, ${particle.opacity * pulse * 0.6})`);
        outerGlow.addColorStop(0.5, `rgba(30, 144, 255, ${particle.opacity * pulse * 0.3})`);
        outerGlow.addColorStop(1, 'rgba(30, 144, 255, 0)');

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner particle
        const innerGlow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );
        innerGlow.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * pulse})`);
        innerGlow.addColorStop(0.3, `rgba(30, 144, 255, ${particle.opacity * pulse * 0.9})`);
        innerGlow.addColorStop(1, `rgba(11, 61, 145, ${particle.opacity * pulse * 0.6})`);

        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F2F2F2] to-white">
        {/* Subtle blue gradient overlays */}
        <motion.div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30, 144, 255, 0.08), transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(11, 61, 145, 0.06), transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(30, 144, 255, 0.05), transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Particle Network Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 opacity-90"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="particle-grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#1E90FF"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#particle-grid)" />
        </svg>
      </div>

      {/* Animated Data Flow Lines */}
      <svg className="absolute inset-0 opacity-20" width="100%" height="100%">
        <defs>
          <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(30, 144, 255, 0)" />
            <stop offset="50%" stopColor="rgba(30, 144, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(30, 144, 255, 0)" />
          </linearGradient>
        </defs>
        
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${i * 25},-50 Q ${100 + i * 30},${200 + i * 50} ${200 + i * 40},${dimensions.height + 50}`}
            stroke="url(#flow-gradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="20 80"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -100 }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.3) 100%)',
        }}
      />
    </div>
  );
}