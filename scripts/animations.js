document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize all animations
    initHeroAnimations();
    initServiceCardAnimations();
    initParallaxEffects();
    initEquipmentSliderAnimations();
    initProcessTimelineAnimations();
    initStatCountersAnimations();
    initRevealAnimations();
});

// Hero section animations with delay
function initHeroAnimations() {
    // Stagger hero section headings
    gsap.fromTo('.hero-content h2', 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.3,
            ease: "power3.out"
        }
    );
    
    // Animate CTA button
    gsap.fromTo('.hero-content .cta-button', 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1,
            delay: 1,
            ease: "back.out(1.5)"
        }
    );
    
    // Animate scroll indicator
    gsap.fromTo('.scroll-indicator', 
        { opacity: 0 },
        { 
            opacity: 1, 
            duration: 1.5,
            delay: 1.5,
            ease: "power2.inOut"
        }
    );
}

// Apple-style scroll animations for service cards
function initServiceCardAnimations() {
    // Create a rotation effect on scroll
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        // Define rotation values
        const rotateStart = (i % 2 === 0) ? -5 : 5;
        const rotateEnd = 0;
        
        // Create the rotation animation
        gsap.fromTo(card, 
            { rotationY: rotateStart, opacity: 0, y: 50 },
            {
                rotationY: rotateEnd,
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 1,
                    once: true
                }
            }
        );
    });
}

// Parallax scrolling effects like Apple
function initParallaxEffects() {
    // Subtle parallax for background images
    gsap.utils.toArray('.parallax-background').forEach(bg => {
        gsap.fromTo(bg, 
            { y: -50 },
            {
                y: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });
    
    // Project showcases parallax
    gsap.utils.toArray('.project').forEach((project, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        
        gsap.fromTo(project.querySelector('img'), 
            { scale: 1.1, x: 30 * direction },
            {
                scale: 1,
                x: 0,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: project,
                    start: "top 80%",
                    end: "center center",
                    scrub: true
                }
            }
        );
    });
    
    // Features section parallax
    gsap.utils.toArray('.statement-content').forEach(element => {
        gsap.fromTo(element, 
            { y: 100, opacity: 0.5 },
            {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element.parentElement,
                    start: "top 70%",
                    end: "center center",
                    scrub: true
                }
            }
        );
    });
}

// Equipment slider animation with GSAP
function initEquipmentSliderAnimations() {
    // Create a horizontal scroll effect for equipment items
    const equipmentItems = document.querySelectorAll('.equipment-item');
    
    equipmentItems.forEach((item, i) => {
        gsap.fromTo(item, 
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: i * 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.equipment-showcase',
                    start: "top 70%",
                    once: true
                }
            }
        );
    });
    
    // Animated hover effect for equipment items
    equipmentItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, { y: -10, duration: 0.3, ease: "power2.out" });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, { y: 0, duration: 0.3, ease: "power2.out" });
        });
    });
}

// Timeline animation with drawing effect
function initProcessTimelineAnimations() {
    // Animate the timeline line drawing
    gsap.fromTo('.process-timeline::before', 
        { height: 0 },
        {
            height: '100%',
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: '.process-section',
                start: "top 60%",
                once: true
            }
        }
    );
    
    // Animate each step with staggered delay
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: step,
                start: "top 75%",
                once: true
            }
        });
        
        timeline.fromTo(step.querySelector('.step-number'), 
            { scale: 0, opacity: 0 },
            { 
                scale: 1, 
                opacity: 1, 
                duration: 0.5, 
                ease: "back.out(1.7)" 
            }
        );
        
        timeline.fromTo(step.querySelector('.step-content'), 
            { x: 30, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.5, 
                ease: "power2.out" 
            },
            "-=0.3" // slight overlap
        );
    });
}

// Animated counter for statistics section
function initStatCountersAnimations() {
    gsap.utils.toArray('.stat-item').forEach((stat, i) => {
        const statNumber = stat.querySelector('.stat-number');
        const targetNumber = parseInt(statNumber.getAttribute('data-count'));
        
        // Create timeline for each stat item
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.sustainability-stats',
                start: "top 70%",
                once: true
            }
        });
        
        // Animate number counting up
        timeline.to(statNumber, {
            innerText: targetNumber,
            duration: 2,
            delay: i * 0.2,
            snap: { innerText: 1 }, // snap to integer values
            ease: "power2.inOut",
            onUpdate: function() {
                statNumber.innerText = Math.round(gsap.getProperty(statNumber, "innerText"));
            }
        });
        
        // Add a subtle scale animation
        timeline.fromTo(stat, 
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "back.out(1.2)" 
            },
            "-=1.8" // start during count animation
        );
    });
}

// General reveal animations for scrolling
function initRevealAnimations() {
    // Fade in elements as they scroll into view
    gsap.utils.toArray('.reveal-content').forEach(element => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    once: true
                }
            }
        );
    });
    
    // Staggered reveal for lists and grids
    const revealSections = document.querySelectorAll('.services-container, .portfolio-grid:not(.hidden), .sustainability-content');
    
    revealSections.forEach(section => {
        const items = section.children;
        
        gsap.fromTo(items, 
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    once: true
                }
            }
        );
    });
    
    // Special animations for testimonial
    const testimonial = document.querySelector('.testimonial-content');
    if (testimonial) {
        const blockquote = testimonial.querySelector('blockquote');
        const cite = testimonial.querySelector('cite');
        
        gsap.fromTo(blockquote, 
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: testimonial,
                    start: "top 70%",
                    once: true
                }
            }
        );
        
        gsap.fromTo(cite, 
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: testimonial,
                    start: "top 70%",
                    once: true
                }
            }
        );
    }
    
    // Apple-style header animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Create a scroll-driven animation for the hero content
        ScrollTrigger.create({
            trigger: '.hero-section',
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                // Fade out hero content as user scrolls down
                gsap.to(heroContent, {
                    y: self.progress * 100,
                    opacity: 1 - self.progress,
                    ease: "none",
                    duration: 0
                });
            }
        });
    }
}

// Extra animations for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // 3D hover effect for CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', e => {
            gsap.to(button, {
                scale: 1.05,
                y: -5,
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', e => {
            gsap.to(button, {
                scale: 1,
                y: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mousedown', e => {
            gsap.to(button, {
                scale: 0.98,
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                duration: 0.1
            });
        });
        
        button.addEventListener('mouseup', e => {
            gsap.to(button, {
                scale: 1.05,
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                duration: 0.1
            });
        });
    });
    
    // Service category animations on hover
    document.querySelectorAll('.service-category').forEach(category => {
        category.addEventListener('mouseenter', e => {
            gsap.to(category, {
                y: -8,
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        category.addEventListener('mouseleave', e => {
            gsap.to(category, {
                y: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
});

// Make sure images are loaded before running animations
window.addEventListener('load', function() {
    // Trigger a resize event to recalculate any position-dependent animations
    window.dispatchEvent(new Event('resize'));
    
    // Hide preloader if you have one
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                preloader.style.display = 'none';
            }
        });
    }
});