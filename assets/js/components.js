// Components JavaScript

// Header Component
class HeaderComponent {
    constructor() {
        this.header = document.getElementById('header');
        this.nav = document.getElementById('nav');
        this.menuToggle = document.getElementById('menuToggle');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle scroll for header styling
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    toggleMobileMenu() {
        this.nav.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
        document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.nav.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.header.style.backgroundColor = scrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff';
        this.header.style.backdropFilter = scrolled ? 'blur(10px)' : 'none';
    }
}

// Footer Component
class FooterComponent {
    constructor() {
        this.footer = document.getElementById('footer');
        this.init();
    }
    
    init() {
        this.updateCopyright();
        this.bindEvents();
    }
    
    updateCopyright() {
        const currentYear = new Date().getFullYear();
        const copyrightElement = this.footer.querySelector('.footer-legal p');
        if (copyrightElement) {
            copyrightElement.innerHTML = `&copy; ${currentYear} Мебель. Все права защищены.`;
        }
    }
    
    bindEvents() {
        // Add smooth scrolling for footer links
        const footerLinks = this.footer.querySelectorAll('a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Scroll to Top Component
class ScrollToTopComponent {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Scroll to top when clicked
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 300;
        this.button.classList.toggle('visible', scrolled);
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Form Component
class FormComponent {
    constructor(formElement) {
        this.form = formElement;
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearErrors(input);
            });
        });
    }
    
    setupValidation() {
        // Add required field indicators
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const label = this.form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.textContent += ' *';
            }
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldError(field, isValid, errorMessage) {
        // Remove existing error
        this.clearErrors(field);
        
        if (!isValid) {
            field.classList.add('error');
            
            // Create error message element
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            
            // Insert error message after field
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    }
    
    clearErrors(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    handleSubmit() {
        if (!this.validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        this.setLoadingState(true);
        
        // Simulate form submission (replace with real API call)
        setTimeout(() => {
            console.log('Form submitted:', data);
            this.showSuccessMessage();
            this.resetForm();
            this.setLoadingState(false);
        }, 1000);
    }
    
    setLoadingState(loading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const inputs = this.form.querySelectorAll('input, textarea, button');
        
        if (loading) {
            submitButton.textContent = 'Отправляем...';
            inputs.forEach(input => input.disabled = true);
        } else {
            submitButton.textContent = 'Отправить заявку';
            inputs.forEach(input => input.disabled = false);
        }
    }
    
    showSuccessMessage() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
        
        // Insert success message
        this.form.parentNode.insertBefore(successMessage, this.form);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear all errors
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            this.clearErrors(field);
        });
    }
}

// Animation Component
class AnimationComponent {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Page Navigation Component
class PageNavigationComponent {
    constructor() {
        this.init();
    }
    
    init() {
        // Scroll to top on page navigation
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });
        
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Export components for use in other files
window.Components = {
    HeaderComponent,
    FooterComponent,
    ScrollToTopComponent,
    FormComponent,
    AnimationComponent,
    PageNavigationComponent
};