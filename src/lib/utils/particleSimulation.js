import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

export function initialize3DParticles(
  elements,
  container,
  containerWidth,
  containerHeight,
  baseRadius = 200,
  animationSpeed = 0.0005
) {
  const particles = [];
  let time = 0;

  // Initialize particles
  elements.forEach((el) => {
    const particle = {
      el,
      width: el.offsetWidth,
      height: el.offsetHeight,
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

  // Function to initialize particle positions
  function initializePositions() {
    particles.forEach((particle, index) => {
      const phi = Math.acos(-1 + (2 * index) / elements.length);
      const theta = Math.sqrt(elements.length * Math.PI) * phi;

      // Positions centered around (0,0)
      const x = (containerWidth / 2 - 40) * Math.sin(phi) * Math.cos(theta);
      const y = (containerHeight / 2 - 40) * Math.sin(phi) * Math.sin(theta);
      const z = baseRadius * Math.cos(phi);

      particle.originalX = x;
      particle.originalY = y;
      particle.originalZ = z;
    });
  }

  // Initialize positions
  initializePositions();

  // Function to center the hovered particle
  function centerParticle(particle) {
    particle.isHovered = true;

    const centerX = containerWidth / 2 - particle.width / 2;
    const centerY = containerHeight / 2 - particle.height / 2;

    particle.el.style.transition = 'transform 0.3s ease, opacity 0.3s ease, left 0.3s ease, top 0.3s ease';
    particle.el.style.left = `${centerX}px`;
    particle.el.style.top = `${centerY}px`;
    particle.el.style.transform = `scale(1.5)`;
    particle.el.style.opacity = '1';
    particle.el.style.zIndex = '1000';
  }

  // Function to reset the hovered particle
  function resetParticle(particle) {
    particle.isHovered = false;

    const adjustedX = particle.originalX + containerWidth / 2 - particle.width / 2;
    const adjustedY = particle.originalY + containerHeight / 2 - particle.height / 2;

    particle.el.style.transition = 'transform 0.5s ease, opacity 0.5s ease, left 0.5s ease, top 0.5s ease';
    particle.el.style.zIndex = '';
    particle.el.style.left = `${adjustedX}px`;
    particle.el.style.top = `${adjustedY}px`;
    particle.el.style.transform = `scale(1)`;
    particle.el.style.opacity = '0.9';
  }

  // Attach event listeners
  particles.forEach((particle) => {
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

      // Original positions centered at (0,0)
      let x = particle.originalX + offsetX;
      let y = particle.originalY + offsetY;
      let z = particle.originalZ + offsetZ;

      // Shift to container center and adjust for particle size
      let adjustedX = x + containerWidth / 2 - particle.width / 2;
      let adjustedY = y + containerHeight / 2 - particle.height / 2;

      // Clamp positions to stay within the container
      const minX = 0;
      const maxX = containerWidth - particle.width;
      const minY = 0;
      const maxY = containerHeight - particle.height;

      adjustedX = Math.min(Math.max(minX, adjustedX), maxX);
      adjustedY = Math.min(Math.max(minY, adjustedY), maxY);

      const scale = Math.max(0.8, 1 + z / (2 * baseRadius));
      const opacity = scale * 0.9;

      // Apply positioning and styles
      particle.el.style.left = `${adjustedX}px`;
      particle.el.style.top = `${adjustedY}px`;
      particle.el.style.transform = `scale(${scale})`;
      particle.el.style.opacity = opacity.toString();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Return a cleanup function if needed
  return () => {
    // Clean up event listeners or other resources if necessary
  };
}
