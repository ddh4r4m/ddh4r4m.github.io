/**
 * Skills Section Interactive Features
 * Handles category filtering, progress bar animations, and counter animations
 */
class SkillsInteractions {
    constructor() {
        this.skillsGrid = document.querySelector('.skills-grid');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.progressBars = document.querySelectorAll('.skill-progress-bar');
        
        this.activeCategory = 'all';
        this.isAnimated = false;
        
        this.init();
    }

    init() {
        this.setupCategoryFiltering();
        this.setupProgressBarAnimations();
        this.setupCounterAnimations();
        this.setupHoverEffects();
        this.setupIntersectionObserver();
    }

    setupCategoryFiltering() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.getAttribute('data-category');
                
                if (category !== this.activeCategory) {
                    this.filterSkills(category);
                    this.updateActiveButton(button);
                }
            });
        });
    }

    filterSkills(category) {
        this.activeCategory = category;
        
        this.skillItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                item.classList.remove('filtering-out', 'hidden');
                item.classList.add('filtering-in');
                
                // Staggered animation for filtered items
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            } else {
                item.classList.remove('filtering-in');
                item.classList.add('filtering-out');
                
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });

        // Re-trigger progress bar animations for visible items
        setTimeout(() => {
            this.animateVisibleProgressBars();
        }, 500);
    }

    updateActiveButton(activeButton) {
        this.categoryButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    setupProgressBarAnimations() {
        this.progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--progress-width', width + '%');
        });
    }

    animateVisibleProgressBars() {
        const visibleBars = document.querySelectorAll('.skill-item:not(.hidden) .skill-progress-bar');
        
        visibleBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            
            // Reset animation
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 100);
        });
    }

    setupCounterAnimations() {
        this.statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            counter.textContent = '0';
            counter.setAttribute('data-target', target);
        });
    }

    animateCounters() {
        this.statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60 FPS
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    setupHoverEffects() {
        this.skillItems.forEach(item => {
            const card = item.querySelector('.skill-card');
            const progressBar = item.querySelector('.skill-progress-bar');
            
            card.addEventListener('mouseenter', () => {
                // Animate progress bar on hover
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width + '%';
                
                // Add ripple effect
                this.createRippleEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                // Optional: Reset progress bar animation
                // progressBar.style.width = '0%';
            });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Animate ripple
        requestAnimationFrame(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(1)';
            ripple.style.opacity = '0';
        });
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.isAnimated = true;
                    
                    // Animate progress bars
                    setTimeout(() => {
                        this.animateVisibleProgressBars();
                    }, 500);
                    
                    // Animate counters
                    setTimeout(() => {
                        this.animateCounters();
                    }, 1000);
                }
            });
        }, options);

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    // Public methods for external control
    showCategory(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    }

    resetAnimations() {
        this.isAnimated = false;
        this.progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
        this.statNumbers.forEach(counter => {
            counter.textContent = '0';
        });
    }

    // Search functionality
    searchSkills(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.skillItems.forEach(item => {
            const skillName = item.querySelector('.skill-name').textContent.toLowerCase();
            const skillDescription = item.querySelector('.skill-description').textContent.toLowerCase();
            
            const matches = skillName.includes(searchTerm) || skillDescription.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                item.style.display = 'block';
                item.classList.remove('hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
    }

    // Skill level visualization
    highlightSkillLevel(minLevel) {
        this.skillItems.forEach(item => {
            const level = parseInt(item.getAttribute('data-level'));
            const card = item.querySelector('.skill-card');
            
            if (level >= minLevel) {
                card.classList.add('skill-highlight');
            } else {
                card.classList.remove('skill-highlight');
            }
        });
    }

    // Responsive behavior
    handleResize() {
        // Adjust grid layout for mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.skillsGrid.style.gridTemplateColumns = '1fr';
        } else {
            this.skillsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        }
    }
}

// Add CSS for ripple effect
const rippleStyles = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .skill-highlight {
        border-color: var(--color-secondary) !important;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.3) !important;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Initialize skills interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.skillsInteractions = new SkillsInteractions();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        window.skillsInteractions.handleResize();
    });
});

// Handle theme changes
document.addEventListener('themechange', (e) => {
    // Re-trigger animations for theme change
    if (window.skillsInteractions) {
        setTimeout(() => {
            window.skillsInteractions.animateVisibleProgressBars();
        }, 300);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsInteractions;
}