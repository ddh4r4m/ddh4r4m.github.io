/**
 * Advanced Portfolio JavaScript
 * Cutting-edge animations and interactions
 */

// =============================================
// PRELOADER
// =============================================
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.querySelector('.preloader-progress-bar');
        this.loadedAssets = 0;
        this.totalAssets = 0;
        
        this.init();
    }
    
    init() {
        // Simulate loading progress
        this.simulateLoading();
        
        // Wait for actual page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.complete();
            }, 500);
        });
    }
    
    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            
            this.updateProgress(progress);
            
            if (progress === 100) {
                clearInterval(interval);
            }
        }, 300);
    }
    
    updateProgress(progress) {
        this.progressBar.style.width = `${progress}%`;
    }
    
    complete() {
        this.preloader.classList.add('loaded');
        document.body.classList.add('loaded');
        
        // Initialize other components after preloader
        setTimeout(() => {
            initializeComponents();
        }, 300);
    }
}

// =============================================
// CUSTOM CURSOR
// =============================================
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.outline = document.querySelector('.cursor-outline');
        this.text = document.querySelector('.cursor-text');
        
        this.cursorX = 0;
        this.cursorY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
        
        this.init();
    }
    
    init() {
        // Hide cursor on touch devices
        if ('ontouchstart' in window) {
            this.dot.style.display = 'none';
            this.outline.style.display = 'none';
            return;
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });
        
        // Animate cursor
        this.animateCursor();
        
        // Handle cursor states
        this.handleCursorStates();
    }
    
    animateCursor() {
        const animate = () => {
            // Smooth follow for dot
            this.dotX += (this.cursorX - this.dotX) * 0.3;
            this.dotY += (this.cursorY - this.dotY) * 0.3;
            
            // Slower follow for outline
            this.outlineX += (this.cursorX - this.outlineX) * 0.1;
            this.outlineY += (this.cursorY - this.outlineY) * 0.1;
            
            this.dot.style.left = `${this.dotX}px`;
            this.dot.style.top = `${this.dotY}px`;
            
            this.outline.style.left = `${this.outlineX}px`;
            this.outline.style.top = `${this.outlineY}px`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    handleCursorStates() {
        // Hover state
        const hoverElements = document.querySelectorAll('a, button, [data-cursor]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                const cursorType = el.getAttribute('data-cursor');
                document.body.classList.add('cursor-hover');
                
                if (cursorType) {
                    document.body.classList.add(`cursor-${cursorType}`);
                    
                    if (cursorType === 'view') {
                        this.text.textContent = 'View';
                    }
                }
            });
            
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover', 'cursor-pointer', 'cursor-view');
                this.text.textContent = '';
            });
        });
    }
}

// =============================================
// SMOOTH SCROLL
// =============================================
class SmoothScroll {
    constructor() {
        this.scroll = null;
        this.init();
    }
    
    init() {
        // Initialize Locomotive Scroll
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            smoothMobile: false,
            multiplier: 1,
            lerp: 0.08
        });
        
        // Update on resize
        window.addEventListener('resize', () => {
            this.scroll.update();
        });
        
        // Handle anchor links
        this.handleAnchorLinks();
        
        // Update ScrollTrigger
        this.scroll.on('scroll', ScrollTrigger.update);
        
        ScrollTrigger.scrollerProxy('[data-scroll-container]', {
            scrollTop(value) {
                return arguments.length ? 
                    scroll.scrollTo(value, 0, 0) : 
                    scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            pinType: document.querySelector('[data-scroll-container]').style.transform ? 
                "transform" : "fixed"
        });
        
        ScrollTrigger.addEventListener('refresh', () => this.scroll.update());
        ScrollTrigger.refresh();
    }
    
    handleAnchorLinks() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    this.scroll.scrollTo(target);
                }
            });
        });
    }
}

// =============================================
// THEME TOGGLE
// =============================================
class ThemeToggle {
    constructor() {
        this.toggle = document.querySelector('.theme-toggle');
        this.theme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Handle toggle click
        this.toggle.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
            
            // Animate theme change
            this.animateThemeChange();
        });
    }
    
    animateThemeChange() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach((el, i) => {
            el.style.transition = 'none';
            
            setTimeout(() => {
                el.style.transition = '';
            }, i * 0.5);
        });
    }
}

// =============================================
// HERO ANIMATIONS
// =============================================
class HeroAnimations {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create particles
        this.createParticles();
        
        // Animate particles
        this.animateParticles();
        
        // Initialize text animations
        this.initTextAnimations();
        
        // Initialize role carousel
        this.initRoleCarousel();
        
        // Initialize floating cards
        this.initFloatingCards();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animateParticles() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw particles
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
                this.ctx.fill();
            });
            
            // Draw connections
            this.particles.forEach((p1, i) => {
                this.particles.slice(i + 1).forEach(p2 => {
                    const distance = Math.sqrt(
                        Math.pow(p1.x - p2.x, 2) + 
                        Math.pow(p1.y - p2.y, 2)
                    );
                    
                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                        this.ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    initTextAnimations() {
        // Split text for animation
        const titleElements = document.querySelectorAll('[data-splitting]');
        
        titleElements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            
            // Split by lines
            const lines = el.querySelectorAll('.line');
            
            lines.forEach(line => {
                const lineText = line.textContent;
                line.innerHTML = '';
                
                // Split by characters
                lineText.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.style.setProperty('--char-index', i);
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    line.appendChild(span);
                });
            });
        });
    }
    
    initRoleCarousel() {
        const roles = document.querySelectorAll('.role-item');
        let currentIndex = 0;
        
        setInterval(() => {
            roles[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % roles.length;
            roles[currentIndex].classList.add('active');
        }, 4000);
    }
    
    initFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach(card => {
            // Tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale(1.05)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// =============================================
// NAVIGATION
// =============================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.lastScroll = 0;
        
        this.init();
    }
    
    init() {
        // Handle scroll
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.lastScroll = currentScroll;
        });
        
        // Handle mobile menu
        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            // Add menu animation here
        });
        
        // Magnetic effect for nav links
        this.initMagneticEffect();
    }
    
    initMagneticEffect() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }
}

// =============================================
// SKILLS 3D SCENE
// =============================================
class Skills3D {
    constructor() {
        this.canvas = document.getElementById('skills-canvas');
        if (!this.canvas) return;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.spheres = [];
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x6366f1, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
        
        // Create spheres
        this.createSpheres();
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Animate
        this.animate();
    }
    
    createSpheres() {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        
        for (let i = 0; i < 10; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
                shininess: 100
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            
            // Random position
            sphere.position.x = (Math.random() - 0.5) * 8;
            sphere.position.y = (Math.random() - 0.5) * 8;
            sphere.position.z = (Math.random() - 0.5) * 8;
            
            // Random velocity
            sphere.velocity = {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            };
            
            this.spheres.push(sphere);
            this.scene.add(sphere);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate spheres
        this.spheres.forEach(sphere => {
            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;
            
            // Move spheres
            sphere.position.x += sphere.velocity.x;
            sphere.position.y += sphere.velocity.y;
            sphere.position.z += sphere.velocity.z;
            
            // Bounce off boundaries
            if (Math.abs(sphere.position.x) > 4) sphere.velocity.x *= -1;
            if (Math.abs(sphere.position.y) > 4) sphere.velocity.y *= -1;
            if (Math.abs(sphere.position.z) > 4) sphere.velocity.z *= -1;
        });
        
        // Rotate camera
        this.camera.position.x = Math.sin(Date.now() * 0.0005) * 5;
        this.camera.position.z = Math.cos(Date.now() * 0.0005) * 5;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
}

// =============================================
// PORTFOLIO FILTER & ANIMATIONS
// =============================================
class Portfolio {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        // Handle filter clicks
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterPortfolio(filter);
                
                // Update active button
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Initialize ScrollTrigger animations
        this.initScrollAnimations();
        
        // Initialize hover effects
        this.initHoverEffects();
    }
    
    filterPortfolio(filter) {
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                gsap.fromTo(item, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
                );
            } else {
                gsap.to(item, {
                    opacity: 0,
                    y: -30,
                    duration: 0.3,
                    ease: 'power3.in',
                    onComplete: () => {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }
    
    initScrollAnimations() {
        this.portfolioItems.forEach((item, i) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 80%',
                onEnter: () => {
                    gsap.fromTo(item,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: 'power3.out',
                            onComplete: () => {
                                item.classList.add('visible');
                            }
                        }
                    );
                }
            });
        });
    }
    
    initHoverEffects() {
        this.portfolioItems.forEach(item => {
            const imageReveal = item.querySelector('.image-reveal');
            const image = item.querySelector('img');
            
            item.addEventListener('mouseenter', () => {
                gsap.to(imageReveal, {
                    y: '0%',
                    duration: 0.6,
                    ease: 'power3.inOut'
                });
                
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(imageReveal, {
                    y: '100%',
                    duration: 0.6,
                    ease: 'power3.inOut'
                });
                
                gsap.to(image, {
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
        });
    }
}

// =============================================
// ABOUT SECTION ANIMATIONS
// =============================================
class AboutAnimations {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        
        this.init();
    }
    
    init() {
        // Animate stats on scroll
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    this.animateNumber(stat, target);
                }
            });
        });
        
        // Timeline interactions
        this.timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                this.timelineItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Parallax effects
        this.initParallax();
    }
    
    animateNumber(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    initParallax() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Parallax shapes
        gsap.to('.shape-1', {
            y: -200,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        gsap.to('.shape-2', {
            y: 200,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
}

// =============================================
// PHOTOGRAPHY SECTION
// =============================================
class Photography {
    constructor() {
        this.filterButtons = document.querySelectorAll('.photo-filter-btn');
        this.photoItems = document.querySelectorAll('.photo-item');
        this.photoWrappers = document.querySelectorAll('.photo-wrapper');
        this.activeFilter = 'all';
        this.lightbox = null;
        this.currentImageIndex = 0;
        this.images = [];
        
        this.init();
    }
    
    init() {
        // Handle filter clicks
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterPhotos(filter);
                
                // Update active button
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize lightbox
        this.initLightbox();
        
        // Collect all images for lightbox navigation
        this.collectImages();
    }
    
    filterPhotos(filter) {
        this.photoItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                gsap.fromTo(item, 
                    { opacity: 0, y: 30, scale: 0.8 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
                );
            } else {
                gsap.to(item, {
                    opacity: 0,
                    y: -30,
                    scale: 0.8,
                    duration: 0.3,
                    ease: 'power3.in',
                    onComplete: () => {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }
    
    initScrollAnimations() {
        this.photoItems.forEach((item, i) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 80%',
                onEnter: () => {
                    gsap.fromTo(item,
                        { opacity: 0, y: 50, rotationY: 15 },
                        {
                            opacity: 1,
                            y: 0,
                            rotationY: 0,
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: 'power3.out',
                            onComplete: () => {
                                item.classList.add('visible');
                            }
                        }
                    );
                }
            });
        });
        
        // Parallax effect for photo items
        this.photoItems.forEach(item => {
            gsap.to(item, {
                y: -50,
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }
    
    initLightbox() {
        // Create lightbox HTML
        this.createLightbox();
        
        // Add click handlers to photo wrappers
        this.photoWrappers.forEach((wrapper, index) => {
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('img');
                this.openLightbox(img.src, index);
            });
        });
    }
    
    createLightbox() {
        const lightboxHTML = `
            <div class="photo-lightbox" id="photo-lightbox">
                <div class="lightbox-content">
                    <button class="lightbox-close" id="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="lightbox-nav lightbox-prev" id="lightbox-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-nav lightbox-next" id="lightbox-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <img class="lightbox-image" id="lightbox-image" src="" alt="">
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        this.lightbox = document.getElementById('photo-lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        
        // Event listeners
        document.getElementById('lightbox-close').addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightbox-prev').addEventListener('click', () => this.prevImage());
        document.getElementById('lightbox-next').addEventListener('click', () => this.nextImage());
        
        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }
    
    collectImages() {
        this.images = Array.from(this.photoWrappers).map(wrapper => {
            const img = wrapper.querySelector('img');
            return {
                src: img.src,
                alt: img.alt
            };
        });
    }
    
    openLightbox(src, index) {
        this.currentImageIndex = index;
        this.lightboxImage.src = src;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate in
        gsap.fromTo(this.lightboxImage, 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' }
        );
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
    
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
    
    updateLightboxImage() {
        const currentImage = this.images[this.currentImageIndex];
        
        gsap.to(this.lightboxImage, {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
                this.lightboxImage.src = currentImage.src;
                this.lightboxImage.alt = currentImage.alt;
                
                gsap.to(this.lightboxImage, {
                    opacity: 1,
                    duration: 0.15
                });
            }
        });
    }
}

// =============================================
// CONTACT FORM
// =============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.form.name.value,
                email: this.form.email.value,
                message: this.form.message.value
            };
            
            // Animate submit button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span>';
                this.form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = `
                        <span class="btn-text">Send Message</span>
                        <span class="btn-icon">
                            <i class="fas fa-paper-plane"></i>
                        </span>
                    `;
                }, 2000);
            }, 1500);
        });
    }
}

// =============================================
// INITIALIZE COMPONENTS
// =============================================
function initializeComponents() {
    // Initialize all components
    const customCursor = new CustomCursor();
    const smoothScroll = new SmoothScroll();
    const themeToggle = new ThemeToggle();
    const heroAnimations = new HeroAnimations();
    const navigation = new Navigation();
    const skills3D = new Skills3D();
    const portfolio = new Portfolio();
    const photography = new Photography();
    const aboutAnimations = new AboutAnimations();
    const contactForm = new ContactForm();
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);
    
    // Global animations
    initGlobalAnimations();
}

// =============================================
// GLOBAL ANIMATIONS
// =============================================
function initGlobalAnimations() {
    // Fade in animations
    const fadeElements = document.querySelectorAll('[data-scroll]');
    
    fadeElements.forEach(el => {
        const speed = el.getAttribute('data-scroll-speed') || 1;
        
        ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
                gsap.fromTo(el,
                    { opacity: 0, y: 50 * speed },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }
                );
            }
        });
    });
    
    // Text reveal animations
    const textElements = document.querySelectorAll('.section-title, .lead');
    
    textElements.forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
                gsap.fromTo(el,
                    { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
                    {
                        opacity: 1,
                        y: 0,
                        clipPath: 'inset(0% 0 0 0)',
                        duration: 1,
                        ease: 'power3.out'
                    }
                );
            }
        });
    });
}

// =============================================
// START THE APPLICATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const preloader = new Preloader();
});