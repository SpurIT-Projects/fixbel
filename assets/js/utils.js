// Utility functions for Фикс.бел website

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle function to limit function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
function getElementById(id) {
    return document.getElementById(id);
}

/**
 * Get elements by class name
 * @param {string} className - Class name
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {NodeList} Collection of elements
 */
function getElementByClass(className, parent = document) {
    return parent.querySelectorAll(`.${className}`);
}

/**
 * Add event listener with error handling
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {boolean} useCapture - Use capture phase (optional)
 */
function addEventListener(element, event, handler, useCapture = false) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (target) {
            target.addEventListener(event, handler, useCapture);
        }
    } catch (error) {
        console.error('Error adding event listener:', error);
    }
}

/**
 * Remove event listener with error handling
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {boolean} useCapture - Use capture phase (optional)
 */
function removeEventListener(element, event, handler, useCapture = false) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (target) {
            target.removeEventListener(event, handler, useCapture);
        }
    } catch (error) {
        console.error('Error removing event listener:', error);
    }
}

/**
 * Add CSS class to element
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} className - Class name to add
 */
function addClass(element, className) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (target) {
            target.classList.add(className);
        }
    } catch (error) {
        console.error('Error adding class:', error);
    }
}

/**
 * Remove CSS class from element
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} className - Class name to remove
 */
function removeClass(element, className) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (target) {
            target.classList.remove(className);
        }
    } catch (error) {
        console.error('Error removing class:', error);
    }
}

/**
 * Toggle CSS class on element
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} className - Class name to toggle
 * @returns {boolean} True if class was added, false if removed
 */
function toggleClass(element, className) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (target) {
            return target.classList.toggle(className);
        }
    } catch (error) {
        console.error('Error toggling class:', error);
        return false;
    }
}

/**
 * Check if element has CSS class
 * @param {HTMLElement|string} element - Element or selector
 * @param {string} className - Class name to check
 * @returns {boolean} True if element has class
 */
function hasClass(element, className) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        return target ? target.classList.contains(className) : false;
    } catch (error) {
        console.error('Error checking class:', error);
        return false;
    }
}

/**
 * Get element's offset position
 * @param {HTMLElement} element - Element to get position for
 * @returns {Object} Object with top and left properties
 */
function getElementOffset(element) {
    if (!element) return { top: 0, left: 0 };
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} element - Element or selector
 * @param {number} offset - Offset from top (optional)
 */
function scrollToElement(element, offset = 0) {
    try {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (target) {
            const elementOffset = getElementOffset(target);
            window.scrollTo({
                top: elementOffset.top - offset,
                behavior: 'smooth'
            });
        }
    } catch (error) {
        console.error('Error scrolling to element:', error);
    }
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
function formatPhone(phone) {
    if (!phone) return '';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format Belarusian number
    if (cleaned.length === 12 && cleaned.startsWith('375')) {
        return `+375 (${cleaned.substr(3, 2)}) ${cleaned.substr(5, 3)}-${cleaned.substr(8, 2)}-${cleaned.substr(10, 2)}`;
    }
    
    return phone;
}

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Get current viewport dimensions
 * @returns {Object} Object with width and height properties
 */
function getViewportSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible in viewport
 */
function isElementInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Load script dynamically
 * @param {string} src - Script source URL
 * @param {Function} callback - Callback function (optional)
 */
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    if (callback) {
        script.onload = callback;
        script.onerror = () => console.error(`Failed to load script: ${src}`);
    }
    
    document.head.appendChild(script);
}

/**
 * Local storage helper
 */
const storage = {
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting localStorage item:', error);
        }
    },
    
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key not found
     * @returns {*} Stored value or default value
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting localStorage item:', error);
            return defaultValue;
        }
    },
    
    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing localStorage item:', error);
        }
    }
};

// Export for use in other modules
window.Utils = {
    debounce,
    throttle,
    getElementById,
    getElementByClass,
    addEventListener,
    removeEventListener,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    getElementOffset,
    scrollToElement,
    formatPhone,
    isValidEmail,
    getViewportSize,
    isElementInViewport,
    loadScript,
    storage
};