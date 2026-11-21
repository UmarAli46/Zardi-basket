'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * HeroEggCanvas:
 * Interactive 3D WebGL Half-White & Half-Golden-Brown Egg
 * Framed by enlarged 2D Poster Hens based on user reference:
 * - Left: Large Desi Hen (facing LEFT, outward) on the golden-brown side
 * - Right: Large Farmy Hen (facing RIGHT, outward) on the white side
 * - Center: Full 3D Egg (half white, half golden-brown, no seam ring, no nest cutting into it)
 * - Ground: Ambient soft contact shadow
 * - Cleanly positioned inside the Hero Section without any nest or banner clutter
 */
export default function HeroEggCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL Canvas dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Master Group for 3D elements (for mouse parallax)
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Generate Natural Ovoid (Egg) Profile Points (Full, Uncut Egg)
    const points: THREE.Vector2[] = [];
    const segments = 54;
    const eggHeightHalf = 1.72;
    const maxRadius = 1.22;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI;
      const y = Math.cos(theta) * eggHeightHalf;
      const normalizedY = y / eggHeightHalf;
      // Natural egg taper: narrower top, fuller rounded base
      const taper = 1.0 - 0.22 * normalizedY;
      const r = Math.sin(theta) * maxRadius * taper;
      points.push(new THREE.Vector2(Math.max(0, r), y));
    }

    // Central 3D Egg Group
    const eggGroup = new THREE.Group();
    eggGroup.position.set(0, 0, 0);
    masterGroup.add(eggGroup);

    // Half 1: Organic Desi Yellow/Golden-Brown Eggshell (facing LEFT / Desi Hen side, Phi PI to 2*PI)
    const brownEggGeom = new THREE.LatheGeometry(points, 54, Math.PI, Math.PI);
    brownEggGeom.computeVertexNormals();
    const brownEggMat = new THREE.MeshPhysicalMaterial({
      color: 0xc87d26, // Warm organic golden brown
      roughness: 0.28,
      metalness: 0.04,
      clearcoat: 0.28,
      clearcoatRoughness: 0.18,
      reflectivity: 0.65,
    });
    const brownEggMesh = new THREE.Mesh(brownEggGeom, brownEggMat);
    eggGroup.add(brownEggMesh);

    // Half 2: Commercial Farmy White Eggshell (facing RIGHT / Farmy Hen side, Phi 0 to PI)
    const whiteEggGeom = new THREE.LatheGeometry(points, 54, 0, Math.PI);
    whiteEggGeom.computeVertexNormals();
    const whiteEggMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcfbfa, // Crisp pure eggshell white
      roughness: 0.26,
      metalness: 0.02,
      clearcoat: 0.22,
      clearcoatRoughness: 0.16,
      reflectivity: 0.55,
    });
    const whiteEggMesh = new THREE.Mesh(whiteEggGeom, whiteEggMat);
    eggGroup.add(whiteEggMesh);

    // Slight initial tilt for elegance
    eggGroup.rotation.z = -0.06;
    eggGroup.rotation.x = 0.05;

    // Floating Golden Aura Particles
    const particleCount = 45;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6.0;
      positions[i + 1] = (Math.random() - 0.5) * 6.0;
      positions[i + 2] = (Math.random() - 0.5) * 3.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe8981a,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(particles);

    // Dual-Tone Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // Warm Golden Directional Light on the Left (Desi side)
    const desiLight = new THREE.DirectionalLight(0xffb703, 2.5);
    desiLight.position.set(-5, 4, 4);
    scene.add(desiLight);

    // Cool Crisp Directional Light on the Right (Farmy side)
    const whiteLight = new THREE.DirectionalLight(0xf2f8ff, 2.2);
    whiteLight.position.set(5, 4, 4);
    scene.add(whiteLight);

    // Soft Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xe8981a, 2.0);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    // Interactive Drag & Parallax Handling
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.45;
      targetY = y * 0.35;

      setMouseOffset({ x, y });

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        eggGroup.rotation.y += deltaX * 0.012;
        eggGroup.rotation.x += deltaY * 0.008;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    // Touch support for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        eggGroup.rotation.y += deltaX * 0.015;
        eggGroup.rotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth auto-rotation & gentle hover float
      if (!isDragging) {
        eggGroup.rotation.y += 0.008;
        eggGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      // Parallax easing on master group
      masterGroup.rotation.x += (targetY - masterGroup.rotation.x) * 0.05;
      masterGroup.rotation.y += (targetX - masterGroup.rotation.y) * 0.05;

      // Particle gentle rotation
      particles.rotation.y -= 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      whiteEggGeom.dispose();
      whiteEggMat.dispose();
      brownEggGeom.dispose();
      brownEggMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        position: 'relative',
        cursor: isInteracting ? 'grabbing' : 'grab',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <style>{`
        /* Left: Enlarged 2D Poster Desi Hen (Facing Left, Outward) */
        .desi-hen-wrapper {
          position: absolute;
          left: 0%;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          pointer-events: none;
          width: 160px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 14px 28px rgba(232, 152, 26, 0.22));
          animation: desiHenHover 4.5s ease-in-out infinite;
        }

        /* Right: Enlarged 2D Poster Farmy Hen (Facing Right, Outward) */
        .farmy-hen-wrapper {
          position: absolute;
          right: 0%;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          pointer-events: none;
          width: 160px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 14px 28px rgba(30, 58, 47, 0.15));
          animation: farmyHenHover 4s ease-in-out infinite;
        }

        @media (min-width: 600px) {
          .desi-hen-wrapper,
          .farmy-hen-wrapper {
            width: 200px;
          }
        }

        @media (min-width: 900px) {
          .desi-hen-wrapper {
            left: 0%;
            width: 235px;
          }
          .farmy-hen-wrapper {
            right: 0%;
            width: 235px;
          }
        }

        @media (min-width: 1200px) {
          .desi-hen-wrapper {
            left: 2%;
            width: 255px;
          }
          .farmy-hen-wrapper {
            right: 2%;
            width: 255px;
          }
        }

        .hen-hero-img {
          width: 100%;
          height: auto;
          display: block;
        }

        @keyframes desiHenHover {
          0%, 100% { transform: translateY(-50%) rotate(0deg); }
          50% { transform: translateY(calc(-50% - 8px)) rotate(-1deg); }
        }

        @keyframes farmyHenHover {
          0%, 100% { transform: translateY(-50%) rotate(0deg); }
          50% { transform: translateY(calc(-50% - 7px)) rotate(1deg); }
        }

        /* Soft Ambient Ground Shadow under 3D Egg */
        .egg-ground-shadow {
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 24px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(30, 58, 47, 0.25) 0%, rgba(30, 58, 47, 0) 70%);
          filter: blur(6px);
          z-index: 1;
          pointer-events: none;
        }

        /* Three.js Canvas sitting in front of the hens */
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 2;
          pointer-events: auto;
        }
      `}</style>

      {/* 1. Left: Enlarged 2D Poster Desi Hen (facing left) */}
      <div
        className="desi-hen-wrapper"
        style={{
          transform: `translate3d(${mouseOffset.x * 12}px, calc(-50% + ${mouseOffset.y * 10}px), 0)`,
        }}
      >
        <img
          src="/images/desi-hen-hero.png"
          alt="Desi Hen facing left on the golden-brown egg side"
          className="hen-hero-img"
        />
      </div>

      {/* 2. Right: Enlarged 2D Poster Farmy Hen (facing right) */}
      <div
        className="farmy-hen-wrapper"
        style={{
          transform: `translate3d(${-mouseOffset.x * 12}px, calc(-50% + ${-mouseOffset.y * 10}px), 0)`,
        }}
      >
        <img
          src="/images/farmy-hen-hero.png"
          alt="Farmy Hen facing right on the white egg side"
          className="hen-hero-img"
        />
      </div>

      {/* 3. Soft Ambient Ground Shadow beneath the 3D Egg */}
      <div className="egg-ground-shadow" />

      {/* 4. Three.js Canvas: 3D Egg in front, 100% uncut, spinning in WebGL */}
    </div>
  );
}
