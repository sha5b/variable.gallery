import { getProductUrl } from './mediaUtils.js';

/**
 * Store animation frame IDs and touch data for each slider
 * @type {Map<HTMLElement, number>}
 */
const animationFrameIds = new Map();

/**
 * Store touch data for sliders
 * @type {Map<HTMLElement, { startX: number, startScroll: number, lastX: number, velocity: number }>}
 */
const touchData = new Map();

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
 * Handle touch start event
 * @param {TouchEvent} event - Touch event
 * @param {HTMLElement} slider - Slider container element
 */
export function handleTouchStart(event, slider) {
    const touch = event.touches[0];
    touchData.set(slider, {
        startX: touch.clientX,
        startScroll: slider.scrollLeft,
        lastX: touch.clientX,
        velocity: 0
    });
}

/**
 * Handle touch move event
 * @param {TouchEvent} event - Touch event
 * @param {HTMLElement} slider - Slider container element
 */
export function handleTouchMove(event, slider) {
    event.preventDefault();
    const touch = event.touches[0];
    const data = touchData.get(slider);
    
    if (data) {
        const deltaX = touch.clientX - data.lastX;
        slider.scrollLeft = slider.scrollLeft - deltaX;
        
        // Update velocity
        data.velocity = deltaX;
        data.lastX = touch.clientX;
    }
}

/**
 * Handle touch end event with momentum scrolling
 * @param {TouchEvent} event - Touch event
 * @param {HTMLElement} slider - Slider container element
 */
export function handleTouchEnd(event, slider) {
    const data = touchData.get(slider);
    if (data) {
        const momentum = data.velocity * 8; // Adjust multiplier for momentum strength
        let currentScroll = slider.scrollLeft;
        
        function momentumScroll() {
            if (Math.abs(momentum) < 0.1) {
                animationFrameIds.delete(slider);
                return;
            }
            
            currentScroll -= momentum;
            slider.scrollLeft = currentScroll;
            
            const frameId = requestAnimationFrame(momentumScroll);
            animationFrameIds.set(slider, frameId);
        }
        
        const frameId = requestAnimationFrame(momentumScroll);
        animationFrameIds.set(slider, frameId);
        touchData.delete(slider);
    }
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
    touchData.delete(slider);
}
