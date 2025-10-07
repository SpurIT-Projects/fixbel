// Main JavaScript file for Фикс.бел website

class FixBelApp {
    constructor() {
        this.isLoaded = false;
        this.animations = new Map();
        this.observers = new Map();
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAnimations();
        this.handlePageLoad();
    }
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Page load events
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMContentLoaded();
        });
        
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });
        
        // Error handling
        window.addEventListener('error', (e) => {
            this.handleError(e);
        });
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                this.logPerformance();
            });
        }
    }
    
    /**
     * Initialize application components
     */
    initializeComponents() {
        this.initPhoneFormatting();
        this.initImageLazyLoading();
        this.initFormValidation();
        this.initTooltips();
        this.initAnalytics();
    }
    
    /**
     * Handle DOM content loaded
     */
    onDOMContentLoaded() {
        console.log('Фикс.бел - DOM loaded');
        
        // Initialize focus management for accessibility
        this.initFocusManagement();
        
        // Initialize keyboard navigation
        this.initKeyboardNavigation();
        
        // Setup external links
        this.setupExternalLinks();
    }
    
    /**
     * Handle window load
     */
    onWindowLoad() {
        this.isLoaded = true;
        console.log('Фикс.бел - Page fully loaded');
        
        // Start animations
        this.startAnimations();
        
        // Initialize performance optimizations
        this.initPerformanceOptimizations();
    }
    
    /**
     * Initialize phone number formatting
     */
    initPhoneFormatting() {
        const phoneElements = document.querySelectorAll('[data-phone], .phone, a[href^="tel:"]');
        
        phoneElements.forEach(element => {
            const phoneText = element.textContent || element.getAttribute('href');
            if (phoneText) {
                const formattedPhone = Utils.formatPhone(phoneText.replace('tel:', ''));
                if (element.tagName === 'A') {
                    element.textContent = formattedPhone;
                } else {
                    element.textContent = formattedPhone;
                }
            }
        });
    }
    
    /**
     * Initialize image lazy loading
     */
    initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            Utils.addClass(img, 'loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            this.observers.set('images', imageObserver);
        }
    }
    
    /**
     * Initialize form validation
     */
    initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }
    
    /**
     * Validate form
     * @param {HTMLFormElement} form - Form to validate
     * @returns {boolean} True if form is valid
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const fieldValid = this.validateField(input);
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate individual field
     * @param {HTMLElement} field - Field to validate
     * @returns {boolean} True if field is valid
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Remove previous error states
        Utils.removeClass(field, 'error');
        
        if (required && !value) {
            this.showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (value && type === 'email' && !Utils.isValidEmail(value)) {
            this.showFieldError(field, 'Введите корректный email адрес');
            return false;
        }
        
        if (value && type === 'tel' && value.length < 10) {
            this.showFieldError(field, 'Введите корректный номер телефона');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    /**
     * Show field error
     * @param {HTMLElement} field - Field with error
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        Utils.addClass(field, 'error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    /**
     * Clear field error
     * @param {HTMLElement} field - Field to clear error from
     */
    clearFieldError(field) {
        Utils.removeClass(field, 'error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /**
     * Initialize tooltips
     */
    initTooltips() {
        const tooltipElements = document.querySelectorAll('[title], [data-tooltip]');
        
        tooltipElements.forEach(element => {
            this.createTooltip(element);
        });
    }
    
    /**
     * Create tooltip for element
     * @param {HTMLElement} element - Element to add tooltip to
     */
    createTooltip(element) {
        const tooltipText = element.getAttribute('title') || element.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        // Remove title to prevent default tooltip
        element.removeAttribute('title');
        
        element.addEventListener('mouseenter', () => {
            this.showTooltip(element, tooltipText);
        });
        
        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }
    
    /**
     * Show tooltip
     * @param {HTMLElement} element - Element to show tooltip for
     * @param {string} text - Tooltip text
     */
    showTooltip(element, text) {
        let tooltip = document.getElementById('tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.2s;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + window.pageYOffset + 'px';
        tooltip.style.opacity = '1';
    }
    
    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }
    
    /**
     * Initialize analytics
     */
    initAnalytics() {
        // Track phone calls
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('phone_call', {
                    phone_number: link.getAttribute('href').replace('tel:', '')
                });
            });
        });
        
        // Track social media clicks
        document.querySelectorAll('.social-link, .social-btn').forEach(link => {
            link.addEventListener('click', () => {
                const platform = this.getSocialPlatform(link.getAttribute('href'));
                this.trackEvent('social_click', {
                    platform: platform
                });
            });
        });
        
        // Track section visits
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute('id');
                        this.trackEvent('section_view', {
                            section: sectionId
                        });
                    }
                });
            }, { threshold: 0.5 });
            
            document.querySelectorAll('section[id]').forEach(section => {
                sectionObserver.observe(section);
            });
            
            this.observers.set('sections', sectionObserver);
        }
    }
    
    /**
     * Track analytics event
     * @param {string} eventName - Event name
     * @param {Object} parameters - Event parameters
     */
    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Yandex Metrica
        if (typeof ym !== 'undefined') {
            ym(window.yaCounterId, 'reachGoal', eventName, parameters);
        }
        
        console.log('Event tracked:', eventName, parameters);
    }
    
    /**
     * Get social platform from URL
     * @param {string} url - Social media URL
     * @returns {string} Platform name
     */
    getSocialPlatform(url) {
        if (!url) return 'unknown';
        
        if (url.includes('telegram') || url.includes('t.me')) return 'telegram';
        if (url.includes('viber')) return 'viber';
        if (url.includes('instagram')) return 'instagram';
        if (url.includes('facebook')) return 'facebook';
        if (url.includes('vk.com')) return 'vkontakte';
        
        return 'unknown';
    }
    
    /**
     * Setup animations
     */
    setupAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Utils.addClass(entry.target, 'animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.service-card, .stage-card, .hero-location, .widget-card').forEach(element => {
                animationObserver.observe(element);
            });
            
            this.observers.set('animations', animationObserver);
        }
    }
    
    /**
     * Start animations
     */
    startAnimations() {
        // Add CSS for animations
        const animationCSS = `
            .service-card, .stage-card, .hero-location, .widget-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = animationCSS;
        document.head.appendChild(style);
    }
    
    /**
     * Initialize focus management for accessibility
     */
    initFocusManagement() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Перейти к основному содержанию';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 100000;
            border-radius: 0 0 4px 0;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    /**
     * Initialize keyboard navigation
     */
    initKeyboardNavigation() {
        // Escape key functionality
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open menus or modals
                if (window.navigation && window.navigation.isMenuOpen) {
                    window.navigation.closeMobileMenu();
                }
            }
        });
    }
    
    /**
     * Setup external links
     */
    setupExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        
        externalLinks.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }
    
    /**
     * Initialize performance optimizations
     */
    initPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize images
        this.optimizeImages();
    }
    
    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const criticalResources = [
            { href: './assets/css/style.css', as: 'style' },
            { href: './assets/js/utils.js', as: 'script' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Optimize images
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    /**
     * Handle errors
     * @param {Event} error - Error event
     */
    handleError(error) {
        console.error('Фикс.бел Error:', error);
        
        // Track error if analytics is available
        this.trackEvent('javascript_error', {
            message: error.message,
            filename: error.filename,
            line: error.lineno
        });
    }
    
    /**
     * Log performance metrics
     */
    logPerformance() {
        if (!('performance' in window)) return;
        
        const perfData = performance.getEntriesByType('navigation')[0];
        
        console.log('Фикс.бел Performance:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            load: perfData.loadEventEnd - perfData.loadEventStart,
            total: perfData.loadEventEnd - perfData.navigationStart
        });
    }
    
    /**
     * Handle page load
     */
    handlePageLoad() {
        // Add loaded class to body
        document.addEventListener('DOMContentLoaded', () => {
            Utils.addClass(document.body, 'loaded');
        });
        
        window.addEventListener('load', () => {
            Utils.addClass(document.body, 'fully-loaded');
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.fixBelApp = new FixBelApp();
});

// Export for use in other modules
window.FixBelApp = FixBelApp;
