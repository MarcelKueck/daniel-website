/**
 * This script fixes image loading issues in the before/after sliders
 * Run this after the main.js has loaded
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix for before/after sliders
    fixBeforeAfterSliders();
    // Enable lazy loading for images
    setupLazyLoading();
});

function fixBeforeAfterSliders() {
    // Add error handling for all image loads
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        // Skip images that already have error handlers
        if (img.hasAttribute('data-error-handled')) return;
        
        // Mark this image as having error handling
        img.setAttribute('data-error-handled', 'true');
        
        // Add error handling to all images
        img.onerror = function() {
            console.error(`Failed to load image: ${img.src}`);
            // Set a fallback image or background color
            const fallbackSvg = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23184A2C%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22200%22%20font-family%3D%22Arial%22%20font-size%3D%2236%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EBild%20wird%20geladen...%3C%2Ftext%3E%3C%2Fsvg%3E';
            
            // Make sure we don't get into an error loop
            if (img.src !== fallbackSvg) {
                img.src = fallbackSvg;
            }
            
            // Add a class to indicate a failed image
            img.classList.add('image-load-failed');
            if (img.parentElement) {
                img.parentElement.classList.add('has-failed-image');
            }
        };
        
        // Also check images that might have already failed
        if (img.complete && img.naturalHeight === 0) {
            img.onerror();
        }
    });
    
    // Fix the before/after sliders specifically
    const sliders = document.querySelectorAll('.before-after-container');
    sliders.forEach(slider => {
        const beforeImage = slider.querySelector('.before-image img');
        const afterImage = slider.querySelector('.after-image img');
        const sliderHandle = slider.querySelector('.slider-handle');
        
        if (!sliderHandle) return;
        
        // Make sure the slider is properly initialized even if images fail to load
        sliderHandle.style.left = '50%';
        const afterDiv = slider.querySelector('.after-image');
        if (afterDiv) afterDiv.style.width = '50%';
        
        // Add keyboard support for slider
        sliderHandle.setAttribute('tabindex', '0');
        sliderHandle.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                
                const currentLeft = parseFloat(sliderHandle.style.left) || 50;
                let newPosition;
                
                if (e.key === 'ArrowLeft') {
                    newPosition = Math.max(0, currentLeft - 5);
                } else {
                    newPosition = Math.min(100, currentLeft + 5);
                }
                
                sliderHandle.style.left = `${newPosition}%`;
                if (afterDiv) afterDiv.style.width = `${newPosition}%`;
                
                // Update ARIA attributes
                sliderHandle.setAttribute('aria-valuenow', newPosition);
            }
        });
        
        // Ensure both before and after images have the same dimensions
        if (beforeImage && afterImage) {
            beforeImage.onload = afterImage.onload = function() {
                // Ensure both images maintain the same aspect ratio
                if (beforeImage.naturalHeight && beforeImage.naturalWidth) {
                    const aspectRatio = beforeImage.naturalHeight / beforeImage.naturalWidth;
                    slider.style.height = `${slider.offsetWidth * aspectRatio}px`;
                    
                    // Add appropriate alt text for screen readers if missing
                    if (!beforeImage.getAttribute('alt')) {
                        beforeImage.setAttribute('alt', 'Before image');
                    }
                    if (!afterImage.getAttribute('alt')) {
                        afterImage.setAttribute('alt', 'After image');
                    }
                }
            };
        }
        
        // Add additional indicator for loading
        let loadingIndicator = slider.querySelector('.slider-loading-indicator');
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'slider-loading-indicator';
            loadingIndicator.innerHTML = '<div class="spinner"></div>';
            slider.appendChild(loadingIndicator);
        }
        
        // After a brief delay, check if images are loaded and hide the indicator
        setTimeout(() => {
            if (!beforeImage || !afterImage) return;
            
            const imagesLoaded = beforeImage.complete && afterImage.complete && 
                                 beforeImage.naturalHeight > 0 && afterImage.naturalHeight > 0;
            if (imagesLoaded) {
                loadingIndicator.style.display = 'none';
            }
        }, 1000);
    });
}

// Setup lazy loading for images
function setupLazyLoading() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    // Convert some images to lazy-loaded images
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        // Skip small images or images in critical view
        if (img.closest('.hero-section') || img.closest('.main-header')) {
            return;
        }
        
        // Set data-src attribute and use a small placeholder
        if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2244%22%20height%3D%2244%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2244%22%20height%3D%2244%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E';
            
            // Observe the image
            imageObserver.observe(img);
        }
    });
}

// Handle responsive behavior for sliders
window.addEventListener('resize', function() {
    // Reset slider heights
    const sliders = document.querySelectorAll('.before-after-container');
    sliders.forEach(slider => {
        const beforeImage = slider.querySelector('.before-image img');
        if (beforeImage && beforeImage.naturalHeight && beforeImage.naturalWidth) {
            const aspectRatio = beforeImage.naturalHeight / beforeImage.naturalWidth;
            slider.style.height = `${slider.offsetWidth * aspectRatio}px`;
        }
    });
}, { passive: true });

// Fix for images that need to be loaded after language switches
function reloadImagesAfterLanguageSwitch() {
    document.querySelectorAll('img.image-load-failed').forEach(img => {
        // Attempt to reload the failed image
        const originalSrc = img.getAttribute('data-original-src');
        if (originalSrc) {
            img.src = originalSrc;
        }
    });
}

// Expose the function globally
window.reloadImagesAfterLanguageSwitch = reloadImagesAfterLanguageSwitch;