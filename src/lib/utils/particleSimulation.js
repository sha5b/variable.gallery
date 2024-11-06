import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

export function initialize3DParticles(
  elements,
  container,
  containerWidth,
  containerHeight,
  baseRadius = 180,
  animationSpeed = 0.002
) {
  const particles = [];
  let time = 0;

  // Function to initialize particle positions
  function initializePositions() {
    particles.forEach((particle, index) => {
      const phi = Math.acos(-1 + (2 * index) / elements.length);
      const theta = Math.sqrt(elements.length * Math.PI) * phi;

      // Adjust calculations based on container dimensions
      const x = (containerWidth / 2 - 40) * Math.sin(phi) * Math.cos(theta);
      const y = (containerHeight / 2 - 40) * Math.sin(phi) * Math.sin(theta);
      const z = baseRadius * Math.cos(phi);

      particle.originalX = x;
      particle.originalY = y;
      particle.originalZ = z;
    });
  }

  // Initialize particles
  elements.forEach((el, index) => {
    const particle = {
      el,
      originalX: 0, // Will be set in initializePositions
      originalY: 0,
      originalZ: 0,
      noiseOffsetX: Math.random() * 10,
      noiseOffsetY: Math.random() * 10,
      noiseOffsetZ: Math.random() * 10,
      isHovered: false, // Track hover state
    };

    particles.push(particle);
  });

  // Initialize positions
  initializePositions();

  // Function to center the hovered particle
  function centerParticle(particle) {
    particle.isHovered = true;

    // Center position: translate to 0,0,0 relative to container
    // Apply scale via CSS, so we don't scale here
    // Reset any previous transform
    particle.el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    particle.el.style.transform = `translate(-50%, -50%) scale(1.5)`;
    particle.el.style.opacity = '1';
    particle.el.style.zIndex = '1000';
  }

  // Function to reset the hovered particle
  function resetParticle(particle) {
    particle.isHovered = false;

    // Reset transform and opacity
    particle.el.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    particle.el.style.zIndex = '';
    particle.el.style.transform = `translate(-50%, -50%) scale(1)`;
    particle.el.style.opacity = '0.9';
  }

  // Attach event listeners
  particles.forEach((particle, index) => {
    const el = particle.el;

    el.addEventListener('mouseenter', () => centerParticle(particle));
    el.addEventListener('mouseleave', () => resetParticle(particle));
  });

  // Animation loop
  function animate() {
    time += animationSpeed;

    particles.forEach((particle) => {
      if (particle.isHovered) {
        // Skip updating hovered particles
        return;
      }

      const offsetX = noise3D(particle.noiseOffsetX + time, 0, 0) * (containerWidth / 2 - 40);
      const offsetY = noise3D(0, particle.noiseOffsetY + time, 0) * (containerHeight / 2 - 40);
      const offsetZ = noise3D(0, 0, particle.noiseOffsetZ + time) * baseRadius;

      let x = particle.originalX + offsetX;
      let y = particle.originalY + offsetY;
      let z = particle.originalZ + offsetZ;

      // Clamp the values to prevent particles from moving out of bounds
      x = Math.min(Math.max(-containerWidth / 2 + 40, x), containerWidth / 2 - 40);
      y = Math.min(Math.max(-containerHeight / 2 + 40, y), containerHeight / 2 - 40);
      z = particle.originalZ + offsetZ;

      const scale = Math.max(0.8, 1 + z / (2 * baseRadius));
      const opacity = scale * 0.9;

      // Apply positioning via CSS variables or direct transform
      // To avoid conflicting with hover transforms, use separate wrappers or manage via CSS
      // Here, we'll directly set transform for positioning
      particle.el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      particle.el.style.opacity = opacity.toString();
    });

    requestAnimationFrame(animate);
  }

  animate();

  return () => {
    // Clean up if necessary
  };
}
