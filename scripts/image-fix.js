/**
 * This script fixes image loading issues in the before/after sliders
 * Run this after the main.js has loaded
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix for before/after sliders
    fixBeforeAfterSliders();
});

function fixBeforeAfterSliders() {
    // Add error handling for all image loads
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        // Add error handling to all images
        img.onerror = function() {
            console.error(`Failed to load image: ${img.src}`);
            // Set a fallback image or background color
            img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23184A2C%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22200%22%20font-family%3D%22Arial%22%20font-size%3D%2236%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EBild%20wird%20geladen...%3C%2Ftext%3E%3C%2Fsvg%3E';
            // Add a class to indicate a failed image
            img.classList.add('image-load-failed');
            img.parentElement.classList.add('has-failed-image');
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
        
        // Make sure the slider is properly initialized even if images fail to load
        sliderHandle.style.left = '50%';
        slider.querySelector('.after-image').style.width = '50%';
        
        // Ensure both before and after images have the same dimensions
        if (beforeImage && afterImage) {
            beforeImage.onload = afterImage.onload = function() {
                // Ensure both images maintain the same aspect ratio
                const aspectRatio = beforeImage.naturalHeight / beforeImage.naturalWidth;
                slider.style.height = `${slider.offsetWidth * aspectRatio}px`;
            };
        }
        
        // Add additional indicator for loading
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'slider-loading-indicator';
        loadingIndicator.innerHTML = '<div class="spinner"></div>';
        slider.appendChild(loadingIndicator);
        
        // After a brief delay, check if images are loaded and hide the indicator
        setTimeout(() => {
            const imagesLoaded = beforeImage.complete && afterImage.complete && 
                                 beforeImage.naturalHeight > 0 && afterImage.naturalHeight > 0;
            if (imagesLoaded) {
                loadingIndicator.style.display = 'none';
            }
        }, 1000);
    });
}