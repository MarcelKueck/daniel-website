/**
 * Path checker to verify image paths and adjust if needed
 * Run this before other scripts to ensure images are found
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix image paths if needed
    checkAndFixImagePaths();
});

function checkAndFixImagePaths() {
    // List of potential base paths to try
    const potentialPaths = [
        'assets/images/',
        '/assets/images/',
        '../assets/images/',
        '../../assets/images/',
        './assets/images/',
        'images/',
        '/images/',
        '../images/',
        './images/'
    ];
    
    // Test which path works by creating a test image
    function testImagePath(basePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                resolve(true);
            };
            img.onerror = function() {
                resolve(false);
            };
            // Try with a known image
            img.src = `${basePath}forest-bg.jpg`;
            // Set a timeout in case the image hangs
            setTimeout(() => resolve(false), 1000);
        });
    }
    
    // Check all potential paths and update image sources
    async function findWorkingPath() {
        for (const path of potentialPaths) {
            const works = await testImagePath(path);
            if (works) {
                console.log(`Found working image path: ${path}`);
                updateAllImagePaths(path);
                return true;
            }
        }
        
        console.error('Could not find a working image path');
        return false;
    }
    
    // Update all image sources with the working path
    function updateAllImagePaths(workingPath) {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // Skip images that are data URLs or already have absolute URLs
            if (img.src.startsWith('data:') || 
                img.src.startsWith('http://') || 
                img.src.startsWith('https://')) {
                return;
            }
            
            // Extract just the filename from the current src
            const srcParts = img.src.split('/');
            const filename = srcParts[srcParts.length - 1];
            
            // Update with the working path
            img.src = `${workingPath}${filename}`;
        });
    }
    
    // Start the check
    findWorkingPath();
    
    // Also add a fix for background images in CSS that use assets/images
    function updateCSSBackgroundImages() {
        // Create a style element
        const style = document.createElement('style');
        style.textContent = `
            [style*="background-image: url('assets/images/"]::before,
            [style*="background-image: url('images/"]::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(24, 74, 44, 0.2);
                z-index: -1;
            }
        `;
        document.head.appendChild(style);
    }
    
    updateCSSBackgroundImages();
}