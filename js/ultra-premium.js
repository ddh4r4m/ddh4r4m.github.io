/**
 * Ultra-Premium Portfolio JavaScript
 * Inspired by leoleo.studio, we3studio.pl, nicolasbussiere.com
 * Advanced scroll effects, parallax, and sophisticated interactions
 */

class UltraPremiumPortfolio {
    constructor() {
        this.scrollController = null;
        this.cursor = null;
        this.isTouch = false;
        this.currentSection = 0;
        this.sections = [];
        this.parallaxElements = [];
        
        this.init();
    }
    
    init() {
        this.detectTouch();
        this.initCursor();
        this.initSmoothScroll();
        this.initParallax();
        this.initScrollTriggers();
        this.initMagneticElements();
        this.initTextAnimations();
        this.initNavigationEffects();
        this.initAdvancedEffects();
        this.initFullscreenGallery();
        
        // Start the main animation loop
        this.startAnimationLoop();
        
        // Fallback: ensure all content is visible after 3 seconds
        setTimeout(() => {
            console.log('🔧 Running fallback visibility check...');
            const hiddenReveals = document.querySelectorAll('.reveal');
            hiddenReveals.forEach(el => {
                const opacity = parseFloat(window.getComputedStyle(el).opacity);
                if (opacity < 0.5) {
                    console.log('🔧 Making visible:', el);
                    gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
                }
            });
        }, 3000);
        
        // Performance optimization for photography section
        this.optimizePhotographyPerformance();
    }
    
    detectTouch() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (this.isTouch) {
            document.body.classList.add('touch-device');
        }
    }
    
    // ==========================================
    // ADVANCED CURSOR SYSTEM
    // ==========================================
    initCursor() {
        if (this.isTouch) return;
        
        this.cursor = {
            el: document.createElement('div'),
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            isHovering: false
        };
        
        this.cursor.el.className = 'ultra-cursor';
        document.body.appendChild(this.cursor.el);
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.cursor.targetX = e.clientX;
            this.cursor.targetY = e.clientY;
        });
        
        // Hover states
        const hoverElements = document.querySelectorAll('a, button, [data-cursor]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.el.classList.add('hover');
                this.cursor.isHovering = true;
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.el.classList.remove('hover');
                this.cursor.isHovering = false;
            });
        });
    }
    
    updateCursor() {
        if (!this.cursor || this.isTouch) return;
        
        // Smooth lerping
        this.cursor.x += (this.cursor.targetX - this.cursor.x) * 0.1;
        this.cursor.y += (this.cursor.targetY - this.cursor.y) * 0.1;
        
        this.cursor.el.style.transform = `translate3d(${this.cursor.x}px, ${this.cursor.y}px, 0)`;
    }
    
    // ==========================================
    // ADVANCED SMOOTH SCROLL
    // ==========================================
    initSmoothScroll() {
        // Initialize GSAP ScrollTrigger first
        gsap.registerPlugin(ScrollTrigger);
        
        // Temporarily disable Locomotive Scroll to fix visibility issues
        // Use native browser scrolling for now
        console.log('🚄 Using native scroll for better compatibility');
        
        // Enable smooth scrolling via CSS
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Simple scroll-based effects without Locomotive Scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Simple parallax for background elements
            const bgElements = document.querySelectorAll('.ultra-hero-bg-shape');
            bgElements.forEach(el => {
                el.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    // ==========================================
    // ADVANCED PARALLAX EFFECTS - MULTI-LAYER
    // ==========================================
    initParallax() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        // Initialize complex multi-layer parallax system
        this.initMultiLayerParallax();
        
        // Optimized parallax for photo containers only
        this.parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            
            // Check if this is a photo container
            const isPhotoContainer = el.classList.contains('ultra-photo-container');
            
            if (isPhotoContainer) {
                // Use simpler, performance-optimized parallax for photos
                gsap.to(el, {
                    y: () => -(speed * 50), // Reduced movement for better performance
                    ease: "none",
                    scrollTrigger: {
                        trigger: el.closest('.ultra-photo-item'),
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1, // Slower scrub for smoother performance
                        invalidateOnRefresh: true
                    }
                });
            } else {
                // Standard parallax for non-photo elements
                gsap.to(el, {
                    y: () => -(speed * 100),
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0,
                        invalidateOnRefresh: true
                    }
                });
            }
        });
        
        // Initialize background parallax layers
        this.initBackgroundParallax();
    }
    
    initMultiLayerParallax() {
        // Create floating background elements for depth
        const heroSection = document.querySelector('.ultra-hero');
        if (heroSection) {
            // Add floating geometric shapes
            this.createFloatingElements(heroSection);
        }
        
        // Advanced section-based parallax
        const sections = document.querySelectorAll('.ultra-section');
        sections.forEach((section, index) => {
            this.createSectionParallax(section, index);
        });
    }
    
    createFloatingElements(container) {
        const shapes = ['circle', 'triangle', 'square'];
        const colors = ['var(--color-accent)', 'var(--color-grey-300)', 'var(--color-grey-200)'];
        
        for (let i = 0; i < 6; i++) {
            const shape = document.createElement('div');
            shape.className = 'ultra-floating-shape';
            shape.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 60}px;
                height: ${20 + Math.random() * 60}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                opacity: ${0.1 + Math.random() * 0.2};
                border-radius: ${shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0'};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                z-index: 1;
                pointer-events: none;
            `;
            
            container.appendChild(shape);
            
            // Animate floating shapes
            gsap.to(shape, {
                y: `random(-100, 100)`,
                x: `random(-50, 50)`,
                rotation: `random(-180, 180)`,
                duration: `random(15, 25)`,
                ease: "none",
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 5
            });
            
            // Parallax movement on scroll
            gsap.to(shape, {
                y: () => -(Math.random() * 200 + 100),
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1 + Math.random() * 2
                }
            });
        }
    }
    
    createSectionParallax(section, index) {
        // Create depth layers for each section
        const isEven = index % 2 === 0;
        const direction = isEven ? 1 : -1;
        
        // Subtle section movement
        gsap.to(section, {
            y: () => direction * 50,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 2
            }
        });
        
        // Add grain texture overlay
        this.addGrainTexture(section);
    }
    
    addGrainTexture(element) {
        const grain = document.createElement('div');
        grain.className = 'ultra-grain-overlay';
        grain.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.02;
            pointer-events: none;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/><feColorMatrix in="colorNoise" type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.4"/></svg>');
            mix-blend-mode: multiply;
        `;
        
        if (element.style.position !== 'absolute' && element.style.position !== 'relative') {
            element.style.position = 'relative';
        }
        
        element.appendChild(grain);
    }
    
    initBackgroundParallax() {
        let mouseX = 0, mouseY = 0;
        let rafId = null;
        
        // Throttled mouse-based parallax
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
            
            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    // Subtle background movement only for hero
                    const bgElements = document.querySelectorAll('.ultra-hero-bg-shape');
                    bgElements.forEach(el => {
                        gsap.to(el, {
                            x: mouseX * 20,
                            y: mouseY * 20,
                            duration: 2,
                            ease: "power2.out"
                        });
                    });
                    
                    rafId = null;
                });
            }
        });
        
        // Disable mouse tracking for photos to improve performance
        // Only enable subtle scroll-based effects instead
        this.initOptimizedScrollEffects();
    }
    
    initOptimizedScrollEffects() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    
                    // Only apply parallax to non-photo elements
                    const bgElements = document.querySelectorAll('.ultra-hero-bg-shape');
                    bgElements.forEach(el => {
                        const rate = scrolled * -0.3;
                        el.style.transform = `translateY(${rate}px)`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // ==========================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ==========================================
    initScrollTriggers() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Reveal animations - ensure immediate visibility for in-viewport elements
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach((el, index) => {
            // Check if element is already in viewport
            const rect = el.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInViewport) {
                // Immediately show elements that are in viewport
                gsap.set(el, { opacity: 1, y: 0, scale: 1 });
            } else {
                // Animate elements that come into view
                gsap.fromTo(el, 
                    { 
                        opacity: 0, 
                        y: 100,
                        scale: 0.95
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            end: "top 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        });
        
        // Section titles with split text animation
        const sectionTitles = document.querySelectorAll('.ultra-section-title');
        sectionTitles.forEach(title => {
            const chars = title.textContent.split('');
            title.innerHTML = chars.map(char => 
                char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`
            ).join('');
            
            gsap.fromTo(title.children,
                { 
                    opacity: 0,
                    y: 50,
                    rotationX: -90
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    stagger: 0.02,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 80%"
                    }
                }
            );
        });
        
        // Cards animation with sophisticated stagger
        const cards = document.querySelectorAll('.ultra-card');
        cards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                    rotationY: 15
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotationY: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        delay: index * 0.1
                    }
                }
            );
        });
        
        // Navigation hide/show on scroll
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            onUpdate: (self) => {
                const nav = document.querySelector('.ultra-nav');
                if (self.direction === -1) {
                    nav.classList.remove('hidden');
                } else {
                    nav.classList.add('hidden');
                }
            }
        });
    }
    
    // ==========================================
    // MAGNETIC ELEMENTS
    // ==========================================
    initMagneticElements() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(el => {
            let bounds = el.getBoundingClientRect();
            
            const handleMouseMove = (e) => {
                const x = e.clientX - bounds.left - bounds.width / 2;
                const y = e.clientY - bounds.top - bounds.height / 2;
                const strength = parseFloat(el.dataset.magnetic) || 0.3;
                
                gsap.to(el, {
                    x: x * strength,
                    y: y * strength,
                    duration: 0.6,
                    ease: "power3.out"
                });
            };
            
            const handleMouseLeave = () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            };
            
            el.addEventListener('mouseenter', () => {
                bounds = el.getBoundingClientRect();
            });
            
            el.addEventListener('mousemove', handleMouseMove);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
    }
    
    // ==========================================
    // ADVANCED TEXT ANIMATIONS
    // ==========================================
    initTextAnimations() {
        // Split text for hero title
        const heroTitle = document.querySelector('.ultra-hero-title');
        if (heroTitle && typeof SplitText !== 'undefined') {
            const split = new SplitText(heroTitle, { type: "lines,words,chars" });
            
            gsap.fromTo(split.chars,
                { 
                    opacity: 0,
                    y: 100,
                    rotationX: -90
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.2,
                    stagger: 0.02,
                    ease: "back.out(1.7)",
                    delay: 0.5
                }
            );
        }
        
        // Typewriter effect for hero subtitle
        const heroSubtitle = document.querySelector('.ultra-hero-subtitle');
        if (heroSubtitle) {
            const text = heroSubtitle.textContent;
            heroSubtitle.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                heroSubtitle.textContent = text.slice(0, i);
                i++;
                if (i > text.length) {
                    clearInterval(typeInterval);
                }
            }, 30);
        }
    }
    
    // ==========================================
    // NAVIGATION EFFECTS
    // ==========================================
    initNavigationEffects() {
        const navLinks = document.querySelectorAll('.ultra-nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 20%",
                end: "bottom 20%",
                onEnter: () => this.updateActiveNavLink(section.id),
                onEnterBack: () => this.updateActiveNavLink(section.id)
            });
        });
    }
    
    updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.ultra-nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ==========================================
    // ADVANCED EFFECTS
    // ==========================================
    initAdvancedEffects() {
        // Image reveal on scroll
        const images = document.querySelectorAll('.ultra-card-image img');
        images.forEach(img => {
            gsap.set(img, { scale: 1.3 });
            
            ScrollTrigger.create({
                trigger: img,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(img, {
                        scale: 1,
                        duration: 1.5,
                        ease: "power3.out"
                    });
                }
            });
        });
        
        // Background position animation
        const heroImage = document.querySelector('.ultra-hero-image');
        if (heroImage) {
            gsap.to(heroImage, {
                rotation: -2,
                duration: 20,
                ease: "none",
                repeat: -1,
                yoyo: true
            });
        }
        
        // Floating animation for cards
        const floatingCards = document.querySelectorAll('.ultra-card');
        floatingCards.forEach((card, index) => {
            gsap.to(card, {
                y: "random(-10, 10)",
                rotation: "random(-0.5, 0.5)",
                duration: "random(3, 5)",
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: index * 0.2
            });
        });
        
        // Advanced hover effects
        const hoverElements = document.querySelectorAll('.ultra-btn');
        hoverElements.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }
    
    // ==========================================
    // FULLSCREEN GALLERY
    // ==========================================
    initFullscreenGallery() {
        this.galleryImages = Array.from(document.querySelectorAll('[data-fullscreen]'));
        this.currentImageIndex = 0;
        this.modal = document.getElementById('fullscreenModal');
        this.modalImage = document.querySelector('.ultra-fullscreen-image');
        this.closeBtn = document.querySelector('.ultra-fullscreen-close');
        this.prevBtn = document.querySelector('.ultra-fullscreen-prev');
        this.nextBtn = document.querySelector('.ultra-fullscreen-next');
        this.backdrop = document.querySelector('.ultra-fullscreen-backdrop');
        
        // Add click handlers to gallery items
        this.galleryImages.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openFullscreen(index);
            });
        });
        
        // Modal controls
        this.closeBtn?.addEventListener('click', () => this.closeFullscreen());
        this.backdrop?.addEventListener('click', () => this.closeFullscreen());
        this.prevBtn?.addEventListener('click', () => this.navigateGallery(-1));
        this.nextBtn?.addEventListener('click', () => this.navigateGallery(1));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal?.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeFullscreen();
                    break;
                case 'ArrowLeft':
                    this.navigateGallery(-1);
                    break;
                case 'ArrowRight':
                    this.navigateGallery(1);
                    break;
            }
        });
    }
    
    openFullscreen(index) {
        this.currentImageIndex = index;
        const imageSrc = this.galleryImages[index].dataset.fullscreen;
        
        this.modalImage.src = imageSrc;
        this.modalImage.style.display = 'block';
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate modal entrance
        gsap.fromTo(this.modalImage, 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        );
    }
    
    closeFullscreen() {
        gsap.to(this.modalImage, {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    navigateGallery(direction) {
        this.currentImageIndex += direction;
        
        // Wrap around
        if (this.currentImageIndex >= this.galleryImages.length) {
            this.currentImageIndex = 0;
        } else if (this.currentImageIndex < 0) {
            this.currentImageIndex = this.galleryImages.length - 1;
        }
        
        const newImageSrc = this.galleryImages[this.currentImageIndex].dataset.fullscreen;
        
        // Animate image transition
        gsap.to(this.modalImage, {
            x: direction * 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                this.modalImage.src = newImageSrc;
                gsap.fromTo(this.modalImage,
                    { x: -direction * 100, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
                );
            }
        });
    }
    
    // ==========================================
    // MAIN ANIMATION LOOP
    // ==========================================
    startAnimationLoop() {
        const animate = () => {
            this.updateCursor();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    // ==========================================
    // PERFORMANCE OPTIMIZATION FOR PHOTOGRAPHY
    // ==========================================
    optimizePhotographyPerformance() {
        const photoSection = document.getElementById('photography');
        if (!photoSection) return;
        
        let isInPhotoSection = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === photoSection) {
                    isInPhotoSection = entry.isIntersecting;
                    
                    // Reduce animation complexity when in photo section
                    const photoContainers = document.querySelectorAll('.ultra-photo-container');
                    photoContainers.forEach(container => {
                        if (isInPhotoSection) {
                            // Simplify animations for better performance
                            container.style.willChange = 'transform';
                        } else {
                            // Reset will-change when not needed
                            container.style.willChange = 'auto';
                        }
                    });
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });
        
        observer.observe(photoSection);
    }
    
    // ==========================================
    // WINDOW RESIZE HANDLER
    // ==========================================
    handleResize() {
        if (this.scrollController) {
            this.scrollController.update();
        }
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
}

// ==========================================
// ADVANCED SCROLL WATCHER
// ==========================================
class AdvancedScrollWatcher {
    constructor() {
        this.callbacks = [];
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    handleScroll() {
        if (!this.isScrolling) {
            this.isScrolling = true;
            this.callbacks.forEach(callback => callback.onStart?.());
        }
        
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.callbacks.forEach(callback => callback.onEnd?.());
        }, 150);
        
        this.callbacks.forEach(callback => callback.onScroll?.(window.pageYOffset));
    }
    
    handleResize() {
        this.callbacks.forEach(callback => callback.onResize?.());
    }
    
    addCallback(callback) {
        this.callbacks.push(callback);
    }
}

// ==========================================
// PERFORMANCE MONITOR
// ==========================================
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frames = 0;
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        const monitor = (currentTime) => {
            this.frames++;
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
                this.frames = 0;
                this.lastTime = currentTime;
                
                // Adjust animation quality based on performance
                if (this.fps < 30) {
                    document.body.classList.add('low-performance');
                } else {
                    document.body.classList.remove('low-performance');
                }
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Wait for all resources to load
    window.addEventListener('load', () => {
        // Initialize the ultra-premium portfolio
        new UltraPremiumPortfolio();
        
        // Initialize performance monitoring
        new PerformanceMonitor();
        
        // Initialize scroll watcher
        const scrollWatcher = new AdvancedScrollWatcher();
        
        // Add scroll effects
        scrollWatcher.addCallback({
            onScroll: (scrollY) => {
                // Update scroll progress
                const progress = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
                document.documentElement.style.setProperty('--scroll-progress', progress);
            }
        });
        
        // Remove loading class
        document.body.classList.add('loaded');
        
        console.log('🚀 Ultra-Premium Portfolio Loaded');
    });
});