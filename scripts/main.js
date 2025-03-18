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
    window.addEventListener('scroll', function() {
        updateHeaderOnScroll();
    });
});

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
    mobileNavToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        mobileNavToggle.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileNavToggle.classList.remove('active');
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
                const headerHeight = header.offsetHeight;
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
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Scroll reveal animations
function initializeScrollReveal() {
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
            timeline.classList.add('active');
            
            // Add active class to steps with delay
            const steps = document.querySelectorAll('.process-step');
            steps.forEach((step, index) => {
                step.style.setProperty('--index', index);
                setTimeout(() => {
                    step.classList.add('active');
                }, 300 + (index * 200));
            });
            
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
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const parent = element.closest('.parallax-section');
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
    });
}

// Initialize before/after sliders with improved error handling
function initializeBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.before-after-container');
    
    sliders.forEach(slider => {
        const sliderHandle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        const beforeImg = slider.querySelector('.before-image img');
        const afterImg = slider.querySelector('.after-image img');
        let isDragging = false;
        
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
        }
        
        // Add error handling for images
        beforeImg.onerror = function() {
            console.error("Failed to load before image:", beforeImg.src);
            // Handle with a fallback color or placeholder
            slider.classList.add('image-loading-error');
        };
        
        afterImg.onerror = function() {
            console.error("Failed to load after image:", afterImg.src);
            // Handle with a fallback color or placeholder
            slider.classList.add('image-loading-error');
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
        }
    });
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', () => {
        sliders.forEach(slider => {
            const beforeImg = slider.querySelector('.before-image img');
            
            // Adjust height based on new width
            if (beforeImg.naturalHeight && beforeImg.naturalWidth) {
                const aspectRatio = beforeImg.naturalHeight / beforeImg.naturalWidth;
                const containerWidth = slider.offsetWidth;
                slider.style.height = `${containerWidth * aspectRatio}px`;
            }
        });
    });
}

// Equipment slider functionality
function initializeEquipmentSlider() {
    const slider = document.querySelector('.equipment-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    const itemWidth = slider.querySelector('.equipment-item').offsetWidth + 16; // include margin
    const visibleItems = Math.floor(slider.offsetWidth / itemWidth);
    let currentIndex = 0;
    
    // Update slider position
    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    
    // Button event listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalItems = slider.querySelectorAll('.equipment-item').length;
        if (currentIndex < totalItems - visibleItems) {
            currentIndex++;
            updateSliderPosition();
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', () => {
        const newVisibleItems = Math.floor(slider.offsetWidth / itemWidth);
        if (newVisibleItems !== visibleItems && currentIndex > 0) {
            // Reset position if visible items changed
            currentIndex = 0;
            updateSliderPosition();
        }
    });
}

// Portfolio tabs
function initializePortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const portfolioGrids = document.querySelectorAll('.portfolio-grid');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Hide all grids and show the selected one
            const category = button.getAttribute('data-category');
            portfolioGrids.forEach(grid => {
                if (grid.id === category) {
                    grid.classList.remove('hidden');
                } else {
                    grid.classList.add('hidden');
                }
            });
        });
    });
}

// Stat counters animation
function initializeStatCounters() {
    const statElements = document.querySelectorAll('.stat-number');
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
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission (in real project, replace with actual form handling)
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate server response (remove in production)
        setTimeout(() => {
            alert('Thank you for your request! We will contact you shortly.');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });
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
        portfolioData[category].forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'portfolio-item reveal-content';
            
            // Set fallback images for before/after portfolio items
            let beforeImgSrc = `assets/images/case${project.title.charAt(0)}-before.jpg`;
            let afterImgSrc = `assets/images/case${project.title.charAt(0)}-after.jpg`;
            
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
                    <div class="slider-handle"></div>
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