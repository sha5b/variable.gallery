let animationFrameId;

export function handleMouseMove(event, slider, options = {}) {
    const {
        scrollSpeed = 1, // Default scroll speed multiplier, adjust for faster or slower
        easing = 0.1       // Easing factor, adjust for smoothness
    } = options;

    const rect = slider.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const sliderWidth = rect.width;
    const maxScroll = slider.scrollWidth - sliderWidth;

    let scrollTarget;

    // Determine scroll direction and target based on mouse position within the container
    if (mouseX < sliderWidth / 3) {
        // Mouse is on the left third of the container, scroll left
        const scrollAmount = (sliderWidth / 3 - mouseX) * scrollSpeed;
        scrollTarget = Math.max(0, slider.scrollLeft - scrollAmount);
    } else if (mouseX > (2 * sliderWidth) / 3) {
        // Mouse is on the right third of the container, scroll right
        const scrollAmount = (mouseX - (2 * sliderWidth) / 3) * scrollSpeed;
        scrollTarget = Math.min(maxScroll, slider.scrollLeft + scrollAmount);
    } else {
        cancelAnimationFrame(animationFrameId); // Stop scrolling if mouse is in the center
        return;
    }

    // Smoothly animate towards the scroll target
    function animateScroll() {
        const distance = scrollTarget - slider.scrollLeft;
        slider.scrollLeft += distance * easing;

        // Continue animating only if the distance is significant
        if (Math.abs(distance) > 0.5) {
            animationFrameId = requestAnimationFrame(animateScroll);
        }
    }

    // Cancel any ongoing animation and start a new one
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animateScroll);
}

// Navigation helper for clickable items within the slider
export function handleProductClick(productId, navigationFunction) {
    navigationFunction(`/shop/${productId}`);
}

// Preload images with fallback for error handling (SSR compatible)
export function preloadImage(src, fallbackSrc) {
    if (typeof window !== 'undefined') {
        const img = new Image();
        img.src = src;
        img.onerror = () => (img.src = fallbackSrc);
        return img.src;
    }
    return fallbackSrc;
}
