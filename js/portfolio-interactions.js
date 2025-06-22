/**
 * Portfolio Section Interactive Features
 * Handles category filtering, image lightbox, and portfolio animations
 */
class PortfolioInteractions {
    constructor() {
        this.portfolioGrid = document.querySelector('.portfolio-grid');
        this.categoryButtons = document.querySelectorAll('.portfolio-category-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.actionButtons = document.querySelectorAll('.action-btn');
        
        this.activeCategory = 'all';
        this.isAnimated = false;
        
        this.init();
    }

    init() {
        this.setupCategoryFiltering();
        this.setupHoverEffects();
        this.setupLightboxIntegration();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
    }

    setupCategoryFiltering() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.getAttribute('data-category');
                
                if (category !== this.activeCategory) {
                    this.filterPortfolio(category);
                    this.updateActiveButton(button);
                }
            });

            // Add keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    filterPortfolio(category) {
        this.activeCategory = category;
        
        // Add loading state
        this.portfolioGrid.style.pointerEvents = 'none';
        
        this.portfolioItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                item.classList.remove('filtering-out', 'portfolio-hidden');
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
                    item.classList.add('portfolio-hidden');
                }, 300);
            }
        });

        // Re-enable interactions after animation
        setTimeout(() => {
            this.portfolioGrid.style.pointerEvents = 'auto';
            this.announceFilterChange(category);
        }, 800);
    }

    updateActiveButton(activeButton) {
        this.categoryButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        });
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-pressed', 'true');
    }

    setupHoverEffects() {
        this.portfolioItems.forEach(item => {
            const card = item.querySelector('.portfolio-card');
            const overlay = item.querySelector('.portfolio-overlay');
            const actions = item.querySelectorAll('.action-btn');
            
            card.addEventListener('mouseenter', () => {
                this.animateActionsIn(actions);
            });

            card.addEventListener('mouseleave', () => {
                this.animateActionsOut(actions);
            });

            // Touch device support
            card.addEventListener('touchstart', (e) => {
                if (!item.classList.contains('touch-active')) {
                    e.preventDefault();
                    this.toggleTouchState(item);
                }
            });
        });
    }

    animateActionsIn(actions) {
        actions.forEach((action, index) => {
            setTimeout(() => {
                action.style.transform = 'translateY(0)';
                action.style.opacity = '1';
            }, index * 100);
        });
    }

    animateActionsOut(actions) {
        actions.forEach(action => {
            action.style.transform = 'translateY(20px)';
            action.style.opacity = '0.8';
        });
    }

    toggleTouchState(item) {
        // Remove touch-active from all items
        this.portfolioItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('touch-active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('touch-active');
    }

    setupLightboxIntegration() {
        // Enhance existing lightbox functionality
        this.actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = this.getButtonAction(button);
                this.trackPortfolioInteraction(action, button);
                
                // Add custom behaviors
                if (button.classList.contains('preview-btn')) {
                    this.handlePreviewClick(e, button);
                } else if (button.classList.contains('code-btn')) {
                    this.handleCodeClick(e, button);
                }
            });
        });
    }

    getButtonAction(button) {
        if (button.classList.contains('preview-btn')) return 'preview';
        if (button.classList.contains('code-btn')) return 'code';
        if (button.classList.contains('zoom-btn')) return 'zoom';
        return 'unknown';
    }

    handlePreviewClick(e, button) {
        // Custom preview handling
        const projectCard = button.closest('.portfolio-card');
        const projectTitle = projectCard.querySelector('.portfolio-title').textContent;
        
        // Add analytics or custom behavior here
        console.log(`Previewing project: ${projectTitle}`);
        
        // If there's no actual link, prevent default and show message
        if (button.getAttribute('href') === '#') {
            e.preventDefault();
            this.showProjectMessage(projectTitle, 'preview');
        }
    }

    handleCodeClick(e, button) {
        // Custom code viewing handling
        const projectCard = button.closest('.portfolio-card');
        const projectTitle = projectCard.querySelector('.portfolio-title').textContent;
        
        console.log(`Viewing code for: ${projectTitle}`);
        
        if (button.getAttribute('href') === '#') {
            e.preventDefault();
            this.showProjectMessage(projectTitle, 'code');
        }
    }

    showProjectMessage(projectTitle, action) {
        // Create a simple modal or notification
        const message = `${action === 'preview' ? 'Live preview' : 'Source code'} for "${projectTitle}" will be available soon.`;
        
        // Simple notification (you could integrate with a proper notification system)
        if (window.alert) {
            alert(message);
        } else {
            console.log(message);
        }
    }

    trackPortfolioInteraction(action, button) {
        // Analytics tracking for portfolio interactions
        const projectCard = button.closest('.portfolio-card');
        const projectTitle = projectCard.querySelector('.portfolio-title').textContent;
        const category = projectCard.querySelector('.portfolio-category').textContent;
        
        // Custom analytics event
        if (window.gtag) {
            gtag('event', 'portfolio_interaction', {
                event_category: 'Portfolio',
                event_label: projectTitle,
                action: action,
                category: category
            });
        }
        
        // Custom tracking
        console.log(`Portfolio interaction: ${action} on ${projectTitle} (${category})`);
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.isAnimated = true;
                    this.triggerPortfolioAnimations();
                }
            });
        }, options);

        const portfolioSection = document.querySelector('.portfolio-section');
        if (portfolioSection) {
            observer.observe(portfolioSection);
        }
    }

    triggerPortfolioAnimations() {
        // Trigger any additional animations when portfolio comes into view
        const visibleItems = document.querySelectorAll('.portfolio-item:not(.portfolio-hidden)');
        
        visibleItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 100);
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for accessibility
        this.portfolioItems.forEach((item, index) => {
            const card = item.querySelector('.portfolio-card');
            
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            
            card.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        const firstAction = item.querySelector('.action-btn');
                        if (firstAction) {
                            firstAction.click();
                        }
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.focusNextItem(index);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.focusPreviousItem(index);
                        break;
                }
            });
        });
    }

    focusNextItem(currentIndex) {
        const visibleItems = Array.from(this.portfolioItems).filter(
            item => !item.classList.contains('portfolio-hidden')
        );
        const nextIndex = (currentIndex + 1) % visibleItems.length;
        const nextCard = visibleItems[nextIndex]?.querySelector('.portfolio-card');
        if (nextCard) {
            nextCard.focus();
        }
    }

    focusPreviousItem(currentIndex) {
        const visibleItems = Array.from(this.portfolioItems).filter(
            item => !item.classList.contains('portfolio-hidden')
        );
        const prevIndex = currentIndex === 0 ? visibleItems.length - 1 : currentIndex - 1;
        const prevCard = visibleItems[prevIndex]?.querySelector('.portfolio-card');
        if (prevCard) {
            prevCard.focus();
        }
    }

    announceFilterChange(category) {
        // Screen reader announcement for filter changes
        const announcement = `Showing ${category === 'all' ? 'all' : category} projects`;
        const srAnnouncement = document.createElement('div');
        srAnnouncement.setAttribute('aria-live', 'polite');
        srAnnouncement.setAttribute('aria-atomic', 'true');
        srAnnouncement.className = 'sr-only';
        srAnnouncement.textContent = announcement;
        
        document.body.appendChild(srAnnouncement);
        
        setTimeout(() => {
            document.body.removeChild(srAnnouncement);
        }, 1000);
    }

    // Public API methods
    showCategory(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    }

    resetAnimations() {
        this.isAnimated = false;
        this.portfolioItems.forEach(item => {
            item.classList.remove('animate-in');
        });
    }

    getVisibleProjects() {
        return Array.from(this.portfolioItems).filter(
            item => !item.classList.contains('portfolio-hidden')
        );
    }

    // Search functionality
    searchProjects(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.portfolioItems.forEach(item => {
            const title = item.querySelector('.portfolio-title').textContent.toLowerCase();
            const description = item.querySelector('.portfolio-description').textContent.toLowerCase();
            const category = item.querySelector('.portfolio-category').textContent.toLowerCase();
            const techs = Array.from(item.querySelectorAll('.tech-tag')).map(
                tag => tag.textContent.toLowerCase()
            ).join(' ');
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          category.includes(searchTerm) ||
                          techs.includes(searchTerm);
            
            if (matches || searchTerm === '') {
                item.style.display = 'block';
                item.classList.remove('portfolio-hidden');
            } else {
                item.style.display = 'none';
                item.classList.add('portfolio-hidden');
            }
        });
    }
}

// Add CSS for screen reader only content
const srOnlyStyles = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .touch-active .portfolio-overlay {
        opacity: 1 !important;
        visibility: visible !important;
    }

    .animate-in {
        animation: portfolioItemIn 0.6s ease-out forwards;
    }

    @keyframes portfolioItemIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = srOnlyStyles;
document.head.appendChild(styleSheet);

// Initialize portfolio interactions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioInteractions = new PortfolioInteractions();
});

// Handle theme changes
document.addEventListener('themechange', (e) => {
    // Re-trigger animations for theme change if needed
    if (window.portfolioInteractions) {
        setTimeout(() => {
            window.portfolioInteractions.triggerPortfolioAnimations();
        }, 300);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioInteractions;
}