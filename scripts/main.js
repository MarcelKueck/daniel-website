document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLanguage();
    initializeNavigation();
    initializeScrollReveal();
    initializeBeforeAfterSliders();
    initializeEquipmentSlider();
    initializePortfolioTabs();
    initializeStatCounters();
    initializeContactForm();
    populatePortfolioContent();
    
    // Add scroll event listener for header
    window.addEventListener('scroll', debounce(function() {
        updateHeaderOnScroll();
    }, 10));
});

// Debounce function to improve scroll performance
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Language management
let currentLanguage = 'de'; // Default language is German

// Initialize language settings
function initializeLanguage() {
    // Check if a language preference is stored
    const storedLanguage = localStorage.getItem('partschLanguage');
    if (storedLanguage) {
        currentLanguage = storedLanguage;
    }
    
    // Set the initial language
    setLanguage(currentLanguage);
    
    // Add event listener to language toggle
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            toggleLanguage();
        });
    }
}

// Set the website language
function setLanguage(lang) {
    currentLanguage = lang;
    
    // Store the language preference
    localStorage.setItem('partschLanguage', lang);
    
    // Update language toggle button text
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.textContent = lang === 'de' ? 'EN' : 'DE';
        languageToggle.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln');
    }
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[key]) {
            // For simple text content
            if (!element.hasAttribute('data-i18n-attr')) {
                element.textContent = translations[key][lang];
            } 
            // For attributes (like placeholders, alts, etc.)
            else {
                const attr = element.getAttribute('data-i18n-attr');
                element.setAttribute(attr, translations[key][lang]);
            }
        }
    });
    
    // Update the lists (special case for service items)
    document.querySelectorAll('[data-i18n-list]').forEach(list => {
        const key = list.getAttribute('data-i18n-list');
        
        if (translations[key] && translations[key][lang]) {
            // Clear the list
            list.innerHTML = '';
            
            // Add new items
            translations[key][lang].forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
        }
    });
    
    // Update ARIA labels for accessibility
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        
        if (translations[key]) {
            element.setAttribute('aria-label', translations[key][lang]);
        }
    });
    
    // Refresh the portfolio content
    populatePortfolioContent();
}

// Toggle between German and English
function toggleLanguage() {
    const newLanguage = currentLanguage === 'de' ? 'en' : 'de';
    setLanguage(newLanguage);
}

// Navigation and header
function initializeNavigation() {
    const header = document.querySelector('.main-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Mobile menu toggle
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
            
            // Update ARIA-expanded attribute for accessibility
            const isExpanded = mainNav.classList.contains('active');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileNavToggle) {
                    mobileNavToggle.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                }
            }
            
            const targetId = this.getAttribute('href');
            
            // If it's just # (homepage link), scroll to top
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update header appearance on scroll
function updateHeaderOnScroll() {
    const header = document.querySelector('.main-header');
    
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Scroll reveal animations
function initializeScrollReveal() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // If not supported, make all elements visible
        document.querySelectorAll('.reveal-content, .reveal-card').forEach(el => {
            el.classList.add('active');
        });
        return;
    }
    
    // Set up Intersection Observer for reveal elements
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Observer for general reveal content
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    // Observer for process steps
    const processObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const timeline = document.querySelector('.process-timeline');
            if (timeline) {
                timeline.classList.add('active');
                
                // Add active class to steps with delay
                const steps = document.querySelectorAll('.process-step');
                steps.forEach((step, index) => {
                    step.style.setProperty('--index', index);
                    setTimeout(() => {
                        step.classList.add('active');
                    }, 300 + (index * 200));
                });
            }
            
            processObserver.unobserve(entries[0].target);
        }
    }, revealOptions);
    
    // Observe all reveal content elements
    document.querySelectorAll('.reveal-content, .reveal-card').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Observe process section
    const processSection = document.querySelector('.process-section');
    if (processSection) {
        processObserver.observe(processSection);
    }
    
    // Setup parallax effect
    setupParallaxEffect();
}

// Parallax scrolling effects
function setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-background');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', debounce(() => {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const parent = element.closest('.parallax-section');
            if (!parent) return;
            
            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (scrollPosition + viewportHeight > parentTop && 
                scrollPosition < parentTop + parentHeight) {
                
                // Calculate how far the element is from the top of the viewport
                const elementInView = (scrollPosition + viewportHeight) - parentTop;
                const percentageInView = elementInView / (parentHeight + viewportHeight);
                
                // Apply parallax effect - move slower than scroll
                const yPos = (percentageInView * 50); // 50 is the amount of parallax effect
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }, 10));
}

// Initialize before/after sliders with improved error handling
function initializeBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.before-after-container');
    
    if (sliders.length === 0) return;
    
    sliders.forEach((slider, sliderIndex) => {
        const sliderHandle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        const beforeImg = slider.querySelector('.before-image img');
        const afterImg = slider.querySelector('.after-image img');
        
        // Skip initialization if required elements don't exist
        if (!sliderHandle || !afterImage || !beforeImg || !afterImg) {
            console.warn('Skipping slider initialization due to missing elements', sliderIndex);
            return;
        }
        
        let isDragging = false;
        
        // Set slider properties for accessibility
        sliderHandle.setAttribute('role', 'slider');
        sliderHandle.setAttribute('aria-label', 'Image comparison slider');
        sliderHandle.setAttribute('aria-valuemin', '0');
        sliderHandle.setAttribute('aria-valuemax', '100');
        sliderHandle.setAttribute('aria-valuenow', '50');
        sliderHandle.setAttribute('tabindex', '0');
        
        // Ensure images are loaded before calculating dimensions
        function ensureImagesLoaded() {
            let beforeLoaded = beforeImg.complete && beforeImg.naturalHeight !== 0;
            let afterLoaded = afterImg.complete && afterImg.naturalHeight !== 0;
            
            if (!beforeLoaded || !afterLoaded) {
                // Add a small delay and try again
                setTimeout(ensureImagesLoaded, 100);
                return;
            }
            
            // Set initial position once images are loaded
            sliderHandle.style.left = '50%';
            afterImage.style.width = '50%';
            
            // Set container height based on image aspect ratio
            if (beforeImg.naturalHeight && beforeImg.naturalWidth) {
                const aspectRatio = beforeImg.naturalHeight / beforeImg.naturalWidth;
                const containerWidth = slider.offsetWidth;
                slider.style.height = `${containerWidth * aspectRatio}px`;
            }
            
            // Hide loading indicator if present
            const loadingIndicator = slider.querySelector('.slider-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
        
        // Add error handling for images
        beforeImg.onerror = function() {
            console.error("Failed to load before image:", beforeImg.src);
            // Handle with a fallback color or placeholder
            slider.classList.add('image-loading-error');
            beforeImg.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23184A2C%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22200%22%20font-family%3D%22Arial%22%20font-size%3D%2236%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20loading%20error%3C%2Ftext%3E%3C%2Fsvg%3E';
        };
        
        afterImg.onerror = function() {
            console.error("Failed to load after image:", afterImg.src);
            // Handle with a fallback color or placeholder
            slider.classList.add('image-loading-error');
            afterImg.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23184A2C%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22200%22%20font-family%3D%22Arial%22%20font-size%3D%2236%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EImage%20loading%20error%3C%2Ftext%3E%3C%2Fsvg%3E';
        };
        
        // Start loading check
        ensureImagesLoaded();
        
        // Mouse events
        sliderHandle.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mousemove', drag);
        
        // Touch events
        sliderHandle.addEventListener('touchstart', startDrag);
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchmove', drag);
        
        // Keyboard events for accessibility
        sliderHandle.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                
                // Get current position
                const currentLeft = parseFloat(sliderHandle.style.left) || 50;
                
                // Calculate new position (5% step)
                let newPosition;
                if (e.key === 'ArrowLeft') {
                    newPosition = Math.max(0, currentLeft - 5);
                } else {
                    newPosition = Math.min(100, currentLeft + 5);
                }
                
                // Update position
                sliderHandle.style.left = `${newPosition}%`;
                afterImage.style.width = `${newPosition}%`;
                
                // Update ARIA value
                sliderHandle.setAttribute('aria-valuenow', newPosition);
            }
        });
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
        }
        
        function stopDrag() {
            isDragging = false;
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            let clientX;
            
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            
            const sliderRect = slider.getBoundingClientRect();
            const sliderWidth = sliderRect.width;
            const offsetX = clientX - sliderRect.left;
            
            // Keep the handle within slider bounds
            let newPosition;
            if (offsetX < 0) {
                newPosition = 0;
            } else if (offsetX > sliderWidth) {
                newPosition = sliderWidth;
            } else {
                newPosition = offsetX;
            }
            
            // Convert to percentage
            const percentage = (newPosition / sliderWidth) * 100;
            
            // Update handle and image position
            sliderHandle.style.left = `${percentage}%`;
            afterImage.style.width = `${percentage}%`;
            
            // Update ARIA value
            sliderHandle.setAttribute('aria-valuenow', Math.round(percentage));
        }
    });
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', debounce(() => {
        sliders.forEach(slider => {
            const beforeImg = slider.querySelector('.before-image img');
            
            if (!beforeImg) return;
            
            // Adjust height based on new width
            if (beforeImg.naturalHeight && beforeImg.naturalWidth) {
                const aspectRatio = beforeImg.naturalHeight / beforeImg.naturalWidth;
                const containerWidth = slider.offsetWidth;
                slider.style.height = `${containerWidth * aspectRatio}px`;
            }
        });
    }, 100));
}

// Equipment slider functionality
function initializeEquipmentSlider() {
    const slider = document.querySelector('.equipment-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    const items = slider.querySelectorAll('.equipment-item');
    if (items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth + 16; // include margin
    const visibleItems = Math.floor(slider.offsetWidth / itemWidth);
    let currentIndex = 0;
    
    // Set ARIA attributes for accessibility
    slider.setAttribute('role', 'region');
    slider.setAttribute('aria-label', 'Equipment showcase');
    
    prevBtn.setAttribute('aria-label', 'Previous equipment');
    nextBtn.setAttribute('aria-label', 'Next equipment');
    
    // Update slider position
    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= items.length - visibleItems;
        
        // Update ARIA attributes
        prevBtn.setAttribute('aria-disabled', currentIndex === 0);
        nextBtn.setAttribute('aria-disabled', currentIndex >= items.length - visibleItems);
    }
    
    // Initial setup
    updateSliderPosition();
    
    // Button event listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalItems = items.length;
        if (currentIndex < totalItems - visibleItems) {
            currentIndex++;
            updateSliderPosition();
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', debounce(() => {
        const newItemWidth = items[0].offsetWidth + 16;
        const newVisibleItems = Math.floor(slider.offsetWidth / newItemWidth);
        
        // Reset position if needed
        if (currentIndex > items.length - newVisibleItems) {
            currentIndex = Math.max(0, items.length - newVisibleItems);
        }
        
        // Update with new dimensions
        updateSliderPosition();
    }, 100));
}

// Portfolio tabs
function initializePortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const portfolioGrids = document.querySelectorAll('.portfolio-grid');
    
    if (tabButtons.length === 0 || portfolioGrids.length === 0) return;
    
    // Set initial ARIA attributes
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', button.classList.contains('active'));
        button.setAttribute('id', `tab-${button.getAttribute('data-category')}`);
        button.setAttribute('aria-controls', button.getAttribute('data-category'));
        
        // Set tabindex based on whether tab is selected
        button.setAttribute('tabindex', button.classList.contains('active') ? '0' : '-1');
    });
    
    portfolioGrids.forEach(grid => {
        grid.setAttribute('role', 'tabpanel');
        grid.setAttribute('aria-labelledby', `tab-${grid.id}`);
        grid.setAttribute('tabindex', '0');
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab button
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });
            
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0');
            
            // Hide all grids and show the selected one
            const category = button.getAttribute('data-category');
            portfolioGrids.forEach(grid => {
                if (grid.id === category) {
                    grid.classList.remove('hidden');
                    grid.removeAttribute('aria-hidden');
                } else {
                    grid.classList.add('hidden');
                    grid.setAttribute('aria-hidden', 'true');
                }
            });
        });
        
        // Keyboard navigation for tabs
        button.addEventListener('keydown', (e) => {
            let targetButton = null;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                // Find previous tab
                const prev = button.previousElementSibling;
                targetButton = prev ? prev : tabButtons[tabButtons.length - 1];
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                // Find next tab
                const next = button.nextElementSibling;
                targetButton = next ? next : tabButtons[0];
            }
            
            if (targetButton && (e.key.startsWith('Arrow'))) {
                e.preventDefault();
                targetButton.click();
                targetButton.focus();
            }
        });
    });
}

// Stat counters animation
function initializeStatCounters() {
    const statElements = document.querySelectorAll('.stat-number');
    
    if (statElements.length === 0) return;
    
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Fallback if not supported
        statElements.forEach(element => {
            const targetCount = parseInt(element.getAttribute('data-count'));
            element.textContent = targetCount;
        });
        return;
    }
    
    const options = {
        threshold: 0.7,
        rootMargin: '0px'
    };
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetCount = parseInt(element.getAttribute('data-count'));
                
                element.classList.add('counting');
                
                // Use CountUp animation
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = 50; // Update every 50ms
                const increment = targetCount / (duration / interval);
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= targetCount) {
                        element.textContent = targetCount;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(count);
                    }
                }, interval);
                
                statObserver.unobserve(element);
            }
        });
    }, options);
    
    statElements.forEach(element => {
        statObserver.observe(element);
    });
}

// Form handling
function initializeContactForm() {
    const form = document.getElementById('tree-assessment-form');
    if (!form) return;
    
    // Add ARIA attributes to form
    form.setAttribute('aria-live', 'polite');
    
    // Create error message elements for form fields
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (!input) return;
        
        // Add ID to input if missing
        if (!input.id) {
            input.id = `form-${input.name}`;
        }
        
        // Create error message container if not exists
        let errorDiv = group.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.id = `${input.id}-error`;
            errorDiv.setAttribute('aria-live', 'polite');
            group.appendChild(errorDiv);
        }
        
        // Add validation event listeners
        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => {
            // Clear error on input
            errorDiv.textContent = '';
            errorDiv.classList.remove('active');
            input.classList.remove('error');
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            if (input) {
                const fieldValid = validateField.call(input);
                isValid = isValid && fieldValid;
            }
        });
        
        if (!isValid) {
            // Focus first invalid field
            const firstInvalid = form.querySelector('.error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }
        
        // Simulate form submission (in real project, replace with actual form handling)
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = currentLanguage === 'de' ? 'Wird gesendet...' : 'Sending...';
        
        // Show loading state
        form.classList.add('submitting');
        
        // Simulate server response (remove in production)
        setTimeout(() => {
            alert(currentLanguage === 'de' 
                ? 'Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.' 
                : 'Thank you for your request! We will contact you shortly.');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.classList.remove('submitting');
        }, 1500);
    });
    
    function validateField() {
        const input = this;
        const errorDiv = document.getElementById(`${input.id}-error`);
        
        // Skip validation if error div doesn't exist
        if (!errorDiv) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = currentLanguage === 'de' 
                ? 'Dieses Feld ist erforderlich.' 
                : 'This field is required.';
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            isValid = false;
            errorMessage = currentLanguage === 'de' 
                ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' 
                : 'Please enter a valid email address.';
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value.trim() && !isValidPhone(input.value)) {
            isValid = false;
            errorMessage = currentLanguage === 'de' 
                ? 'Bitte geben Sie eine gültige Telefonnummer ein.' 
                : 'Please enter a valid phone number.';
        }
        
        // Update UI based on validation
        if (!isValid) {
            input.classList.add('error');
            errorDiv.textContent = errorMessage;
            errorDiv.classList.add('active');
        } else {
            input.classList.remove('error');
            errorDiv.textContent = '';
            errorDiv.classList.remove('active');
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidPhone(phone) {
        // Basic phone validation - can be more specific if needed
        return /^[+\d\s()-]{6,20}$/.test(phone);
    }
}

// Populate portfolio content dynamically based on current language
function populatePortfolioContent() {
    // Use translated data for portfolio projects
    const portfolioData = {
        residential: translations.portfolio_residential[currentLanguage],
        commercial: translations.portfolio_commercial[currentLanguage],
        forest: translations.portfolio_forest[currentLanguage]
    };
    
    // Build HTML for each portfolio category
    Object.keys(portfolioData).forEach(category => {
        const grid = document.getElementById(category);
        if (!grid) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Add new content from translated data
        portfolioData[category].forEach((project, index) => {
            // Use index+1 to create consistent image paths that match actual files
            const caseNumber = index + 1;
            const projectElement = document.createElement('div');
            projectElement.className = 'portfolio-item reveal-content';
            
            // Use numeric case references that match your actual image files
            let beforeImgSrc = `assets/images/case${caseNumber}-before.jpg`;
            let afterImgSrc = `assets/images/case${caseNumber}-after.jpg`;
            
            projectElement.innerHTML = `
                <div class="before-after-container">
                    <div class="before-image">
                        <img src="${beforeImgSrc}" alt="${project.title} ${translations.before[currentLanguage]}"
                             onerror="this.onerror=null; this.src='https://images.pexels.com/photos/235767/pexels-photo-235767.jpeg?auto=compress&cs=tinysrgb&w=800';">
                        <span class="label">${translations.before[currentLanguage]}</span>
                    </div>
                    <div class="after-image">
                        <img src="${afterImgSrc}" alt="${project.title} ${translations.after[currentLanguage]}"
                             onerror="this.onerror=null; this.src='https://images.pexels.com/photos/1179225/pexels-photo-1179225.jpeg?auto=compress&cs=tinysrgb&w=800';">
                        <span class="label">${translations.after[currentLanguage]}</span>
                    </div>
                    <div class="slider-handle" role="slider" aria-label="Image comparison slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0"></div>
                    <div class="slider-loading-indicator">
                        <div class="spinner"></div>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-details">
                        <div class="detail">
                            <h4>${translations.challenge[currentLanguage]}</h4>
                            <p>${project.challenge}</p>
                        </div>
                        <div class="detail">
                            <h4>${translations.approach[currentLanguage]}</h4>
                            <p>${project.approach}</p>
                        </div>
                        <div class="detail">
                            <h4>${translations.results[currentLanguage]}</h4>
                            <p>${project.results}</p>
                        </div>
                    </div>
                </div>
            `;
            
            grid.appendChild(projectElement);
        });
    });
    
    // Re-initialize before/after sliders for new content
    initializeBeforeAfterSliders();
}