/**
 * Hero Section Animations and Interactions
 * Handles typing animation, timeline interactions, and scroll effects
 */
class HeroAnimations {
    constructor() {
        this.typedTextElement = document.getElementById('typed-text');
        this.typingTexts = [
            'Backend Developer',
            'Full-Stack Developer',
            'iOS Developer',
            'UI/UX Designer',
            'Open Source Contributor',
            'Problem Solver'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }

    init() {
        // Start typing animation
        if (this.typedTextElement) {
            this.typeText();
        }
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize timeline interactions
        this.initTimelineInteractions();
        
        // Initialize smooth scrolling for CTA buttons
        this.initSmoothScrolling();
    }

    typeText() {
        const currentText = this.typingTexts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Delete characters
            this.typedTextElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
                setTimeout(() => this.typeText(), 500);
                return;
            }
            
            setTimeout(() => this.typeText(), this.deleteSpeed);
        } else {
            // Type characters
            this.typedTextElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.typeText(), this.pauseTime);
                return;
            }
            
            setTimeout(() => this.typeText(), this.typeSpeed);
        }
    }

    initScrollAnimations() {
        // Create intersection observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe timeline items and other elements
        document.querySelectorAll('.timeline-item, .hero-content > *').forEach(el => {
            observer.observe(el);
        });
    }

    initTimelineInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                this.highlightTimelineItem(item, true);
            });
            
            item.addEventListener('mouseleave', () => {
                this.highlightTimelineItem(item, false);
            });
            
            // Add click effects for mobile
            item.addEventListener('click', () => {
                this.toggleTimelineItem(item);
            });
        });
    }

    highlightTimelineItem(item, highlight) {
        const icon = item.querySelector('.timeline-icon');
        const content = item.querySelector('.timeline-content');
        
        if (highlight) {
            icon.style.transform = 'scale(1.1)';
            icon.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
            content.style.transform = 'translateY(-3px)';
            content.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        } else {
            icon.style.transform = 'scale(1)';
            icon.style.boxShadow = '';
            content.style.transform = 'translateY(0)';
            content.style.boxShadow = '';
        }
    }

    toggleTimelineItem(item) {
        // Mobile interaction - expand/collapse on touch devices
        if ('ontouchstart' in window) {
            item.classList.toggle('expanded');
            
            // Close other expanded items
            document.querySelectorAll('.timeline-item.expanded').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('expanded');
                }
            });
        }
    }

    initSmoothScrolling() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll indicator animation
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const nextSection = document.querySelector('.service_area, .about_me, section:not(.hero-area)');
                if (nextSection) {
                    nextSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // Parallax effect for hero background
    initParallaxEffect() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                heroBackground.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Dynamic skill highlighting based on scroll position
    highlightCurrentSkill() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        timelineItems.forEach((item, index) => {
            const itemTop = item.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;
            
            if (scrollPosition >= itemTop && scrollPosition <= itemBottom) {
                item.classList.add('current');
                
                // Update typing text to match current skill
                const skillTitle = item.querySelector('h4').textContent;
                if (this.typingTexts.indexOf(skillTitle) === -1) {
                    this.typingTexts.unshift(skillTitle);
                }
            } else {
                item.classList.remove('current');
            }
        });
    }

    // Progressive enhancement for reduced motion
    respectMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable typing animation
            if (this.typedTextElement) {
                this.typedTextElement.textContent = this.typingTexts[0];
            }
            
            // Remove auto-animations
            document.querySelectorAll('[style*="animation"]').forEach(el => {
                el.style.animation = 'none';
            });
            
            // Add immediate class for instant visibility
            document.querySelectorAll('.timeline-item, .hero-content > *').forEach(el => {
                el.classList.add('no-animation');
            });
        }
    }
}

// Initialize hero animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroAnimations = new HeroAnimations();
});

// Handle theme changes for hero background
document.addEventListener('themechange', (e) => {
    const heroArea = document.querySelector('.hero-area');
    if (heroArea) {
        // Add a subtle transition effect when theme changes
        heroArea.style.transition = 'background-color 0.3s ease-in-out';
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroAnimations;
}