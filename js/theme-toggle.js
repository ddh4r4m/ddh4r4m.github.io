/**
 * Modern Theme Toggle System
 * Handles dark/light mode switching with smooth transitions
 */
class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.theme, false);
        
        // Create toggle button
        this.createToggleButton();
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
        
        // Add smooth transitions
        this.addTransitionStyles();
    }

    createToggleButton() {
        // Create theme toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'theme-toggle';
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle dark mode');
        toggleButton.innerHTML = `
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        
        // Add click event
        toggleButton.addEventListener('click', () => this.toggle());
        
        // Add to header
        const header = document.querySelector('header .main-header-area .container-fluid .row');
        if (header) {
            const themeToggleContainer = document.createElement('div');
            themeToggleContainer.className = 'col-auto theme-toggle-container';
            themeToggleContainer.appendChild(toggleButton);
            header.appendChild(themeToggleContainer);
        }
        
        // Also add to mobile menu if it exists
        const mobileMenu = document.querySelector('.mobile_menu');
        if (mobileMenu) {
            const mobileToggle = toggleButton.cloneNode(true);
            mobileToggle.addEventListener('click', () => this.toggle());
            mobileMenu.appendChild(mobileToggle);
        }
    }

    addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle {
                position: relative;
                width: 44px;
                height: 44px;
                border-radius: var(--border-radius-lg);
                border: 1px solid var(--border-color);
                background: var(--bg-primary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all var(--transition-normal);
                overflow: hidden;
            }

            .theme-toggle:hover {
                background: var(--bg-secondary);
                transform: scale(1.05);
            }

            .theme-toggle .sun-icon,
            .theme-toggle .moon-icon {
                position: absolute;
                transition: all var(--transition-normal);
                color: var(--text-primary);
            }

            .theme-toggle .sun-icon {
                opacity: 1;
                transform: rotate(0deg) scale(1);
            }

            .theme-toggle .moon-icon {
                opacity: 0;
                transform: rotate(180deg) scale(0.8);
            }

            [data-theme="dark"] .theme-toggle .sun-icon {
                opacity: 0;
                transform: rotate(180deg) scale(0.8);
            }

            [data-theme="dark"] .theme-toggle .moon-icon {
                opacity: 1;
                transform: rotate(0deg) scale(1);
            }

            .theme-toggle-container {
                display: flex;
                align-items: center;
                margin-left: auto;
            }

            /* Smooth transitions for theme changes */
            * {
                transition: background-color var(--transition-normal), 
                           color var(--transition-normal), 
                           border-color var(--transition-normal), 
                           box-shadow var(--transition-normal);
            }

            /* Prevent transition on page load */
            .no-transition * {
                transition: none !important;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .theme-toggle-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: var(--z-fixed);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setTheme(theme, animate = true) {
        this.theme = theme;
        
        if (!animate) {
            document.documentElement.classList.add('no-transition');
        }
        
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update localStorage
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const computedStyles = getComputedStyle(document.documentElement);
        const bgColor = computedStyles.getPropertyValue('--bg-primary').trim();
        metaThemeColor.content = bgColor;
        
        // Remove no-transition class after a brief delay
        if (!animate) {
            setTimeout(() => {
                document.documentElement.classList.remove('no-transition');
            }, 10);
        }
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme: this.theme } 
        }));
    }

    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    listenForSystemThemeChanges() {
        // Listen for system theme preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addListener((e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Set initial theme based on system preference if no saved preference
        if (!localStorage.getItem('theme')) {
            this.setTheme(mediaQuery.matches ? 'dark' : 'light', false);
        }
    }

    // Public API
    getCurrentTheme() {
        return this.theme;
    }

    isDarkMode() {
        return this.theme === 'dark';
    }

    isLightMode() {
        return this.theme === 'light';
    }
}

// Initialize theme toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeToggle = new ThemeToggle();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}