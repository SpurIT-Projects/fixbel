// Scroll functionality and auto-scroll navigation for Фикс.бел website

class ScrollNavigation {
    constructor() {
        this.scrollNav = null;
        this.scrollNavItems = [];
        this.sections = [];
        this.isScrolling = false;
        this.lastScrollTop = 0;
        
        this.init();
    }
    
    /**
     * Initialize scroll navigation functionality
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.updateActiveItem();
    }
    
    /**
     * Bind DOM elements
     */
    bindElements() {
        this.scrollNav = document.getElementById('scroll-nav');
        this.scrollNavItems = document.querySelectorAll('.scroll-nav-item');
        this.sections = document.querySelectorAll('section[id]');
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Scroll navigation item clicks
        this.scrollNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleScrollNavClick(item);
            });
        });
        
        // Window scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));
        
        // Window resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.updateScrollNavPosition();
        }, 250));
        
        // Smooth scroll behavior for all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href').length > 1) {
                this.handleAnchorClick(e, link);
            }
        });
    }
    
    /**
     * Handle scroll navigation item clicks
     * @param {HTMLElement} item - Clicked navigation item
     */
    handleScrollNavClick(item) {
        const targetSection = item.getAttribute('data-section');
        const targetElement = document.getElementById(targetSection);
        
        if (targetElement) {
            this.scrollToSection(targetElement);
            this.setActiveItem(item);
        }
    }
    
    /**
     * Handle anchor link clicks for smooth scrolling
     * @param {Event} e - Click event
     * @param {HTMLElement} link - Anchor link element
     */
    handleAnchorClick(e, link) {
        const href = link.getAttribute('href');
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            this.scrollToSection(targetElement);
        }
    }
    
    /**
     * Scroll to a specific section
     * @param {HTMLElement} element - Target section element
     */
    scrollToSection(element) {
        if (!element) return;
        
        this.isScrolling = true;
        
        // Calculate header height for offset
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offset = headerHeight + 20;
        
        // Smooth scroll to element
        Utils.scrollToElement(element, offset);
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    /**
     * Handle window scroll events
     */
    handleScroll() {
        if (this.isScrolling) return;
        
        this.updateActiveItem();
        this.handleScrollDirection();
    }
    
    /**
     * Update active scroll navigation item based on scroll position
     */
    updateActiveItem() {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const scrollOffset = headerHeight + 100;
        const scrollPosition = window.pageYOffset;
        
        let activeSection = null;
        let activeSectionId = 'home'; // Default to home
        
        // Find the current section
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollPosition - scrollOffset;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
                activeSectionId = section.getAttribute('id');
            }
        });
        
        // Special case for bottom of page
        if (scrollPosition + window.innerHeight >= document.documentElement.scrollHeight - 50) {
            const lastSection = this.sections[this.sections.length - 1];
            if (lastSection) {
                activeSection = lastSection;
                activeSectionId = lastSection.getAttribute('id');
            }
        }
        
        // Update active state
        const activeItem = document.querySelector(`.scroll-nav-item[data-section="${activeSectionId}"]`);
        if (activeItem) {
            this.setActiveItem(activeItem);
        }
    }
    
    /**
     * Set active scroll navigation item
     * @param {HTMLElement} activeItem - Item to set as active
     */
    setActiveItem(activeItem) {
        // Remove active class from all items
        this.scrollNavItems.forEach(item => {
            Utils.removeClass(item, 'active');
        });
        
        // Add active class to current item
        if (activeItem) {
            Utils.addClass(activeItem, 'active');
        }
    }
    
    /**
     * Handle scroll direction for header behavior
     */
    handleScrollDirection() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.header');
        
        if (!header) return;
        
        if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
            // Scrolling down - hide header
            Utils.addClass(header, 'header-hidden');
        } else {
            // Scrolling up - show header
            Utils.removeClass(header, 'header-hidden');
        }
        
        this.lastScrollTop = currentScrollTop;
    }
    
    /**
     * Update scroll navigation position on resize
     */
    updateScrollNavPosition() {
        if (!this.scrollNav) return;
        
        const viewport = Utils.getViewportSize();
        
        // Hide scroll nav on mobile
        if (viewport.width <= 959) {
            this.scrollNav.style.display = 'none';
        } else {
            this.scrollNav.style.display = 'flex';
        }
    }
    
    /**
     * Animate scroll navigation entrance
     */
    animateScrollNavEntrance() {
        if (!this.scrollNav) return;
        
        // Add entrance animation
        Utils.addClass(this.scrollNav, 'scroll-nav-animate');
        
        // Animate items with delay
        this.scrollNavItems.forEach((item, index) => {
            setTimeout(() => {
                Utils.addClass(item, 'scroll-nav-item-animate');
            }, index * 100);
        });
    }
    
    /**
     * Get scroll progress for current section
     * @returns {number} Scroll progress (0-1)
     */
    getCurrentSectionProgress() {
        const activeItem = document.querySelector('.scroll-nav-item.active');
        if (!activeItem) return 0;
        
        const sectionId = activeItem.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        
        if (!section) return 0;
        
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate progress
        let progress = 0;
        
        if (rect.top <= 0) {
            progress = Math.abs(rect.top) / (sectionHeight - windowHeight);
            progress = Math.min(progress, 1);
        }
        
        return progress;
    }
}

// Scroll to top functionality
class ScrollToTop {
    constructor() {
        this.button = null;
        this.isVisible = false;
        
        this.init();
    }
    
    /**
     * Initialize scroll to top functionality
     */
    init() {
        this.createButton();
        this.bindEvents();
    }
    
    /**
     * Create scroll to top button
     */
    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'scroll-to-top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.setAttribute('aria-label', 'Прокрутить наверх');
        this.button.setAttribute('title', 'Прокрутить наверх');
        
        // Add styles
        this.button.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 45px;
            height: 45px;
            background-color: var(--primary-color, #3498db);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 900;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        `;
        
        document.body.appendChild(this.button);
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Button click
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
        
        // Show/hide on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.toggleVisibility();
        }, 100));
    }
    
    /**
     * Toggle button visibility based on scroll position
     */
    toggleVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > 300;
        
        if (shouldShow && !this.isVisible) {
            this.showButton();
        } else if (!shouldShow && this.isVisible) {
            this.hideButton();
        }
    }
    
    /**
     * Show scroll to top button
     */
    showButton() {
        this.isVisible = true;
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
    }
    
    /**
     * Hide scroll to top button
     */
    hideButton() {
        this.isVisible = false;
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
    }
    
    /**
     * Scroll to top of page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize scroll functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.scrollNavigation = new ScrollNavigation();
    window.scrollToTop = new ScrollToTop();
    
    // Animate scroll nav entrance after a delay
    setTimeout(() => {
        if (window.scrollNavigation) {
            window.scrollNavigation.animateScrollNavEntrance();
        }
    }, 1000);
});

// Export for use in other modules
window.ScrollNavigation = ScrollNavigation;
window.ScrollToTop = ScrollToTop;