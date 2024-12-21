import { getProductUrl } from './mediaUtils.js';

/**
 * Store animation frame IDs for each slider
 * @type {Map<HTMLElement, number>}
 */
const animationFrameIds = new Map();

/**
 * Handle mouse movement for slider scrolling
 * @param {MouseEvent} event - Mouse event
 * @param {HTMLElement} slider - Slider container element
 * @param {Object} [options] - Scroll options
 * @param {number} [options.scrollSpeed=1] - Scroll speed multiplier
 * @param {number} [options.easing=0.1] - Easing factor for smooth scrolling
 */
export function handleMouseMove(event, slider, options = {}) {
    const {
        scrollSpeed = 1,
        easing = 0.1
    } = options;

    const rect = slider.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const sliderWidth = rect.width;
    const maxScroll = slider.scrollWidth - sliderWidth;

    /** @type {number|undefined} */
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
        // Stop scrolling if mouse is in the center
        const currentFrameId = animationFrameIds.get(slider);
        if (currentFrameId) {
            cancelAnimationFrame(currentFrameId);
            animationFrameIds.delete(slider);
        }
        return;
    }

    // Smoothly animate towards the scroll target
    function animateScroll() {
        if (typeof scrollTarget !== 'number') return;
        
        const distance = scrollTarget - slider.scrollLeft;
        slider.scrollLeft += distance * easing;

        // Continue animating only if the distance is significant
        if (Math.abs(distance) > 0.5) {
            const frameId = requestAnimationFrame(animateScroll);
            animationFrameIds.set(slider, frameId);
        } else {
            animationFrameIds.delete(slider);
        }
    }

    // Cancel any ongoing animation and start a new one
    const currentFrameId = animationFrameIds.get(slider);
    if (currentFrameId) {
        cancelAnimationFrame(currentFrameId);
    }
    const frameId = requestAnimationFrame(animateScroll);
    animationFrameIds.set(slider, frameId);
}

/**
 * Navigation helper for clickable items within the slider
 * @param {number} productId - Product ID to navigate to
 * @param {(url: string) => void} navigationFunction - Navigation function (e.g., SvelteKit's goto)
 */
export function handleProductClick(productId, navigationFunction) {
    navigationFunction(getProductUrl(productId));
}

/**
 * Preload images with fallback for error handling (SSR compatible)
 * @param {string} src - Primary image source
 * @param {string} fallbackSrc - Fallback image source
 * @returns {string} The resolved image source
 */
export function preloadImage(src, fallbackSrc) {
    if (typeof window !== 'undefined') {
        const img = new Image();
        img.src = src;
        img.onerror = () => (img.src = fallbackSrc);
        return img.src;
    }
    return fallbackSrc;
}

/**
 * Clean up any ongoing animations for a slider
 * @param {HTMLElement} slider - Slider element to clean up
 */
export function cleanupSlider(slider) {
    const frameId = animationFrameIds.get(slider);
    if (frameId) {
        cancelAnimationFrame(frameId);
        animationFrameIds.delete(slider);
    }
}
