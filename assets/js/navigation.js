// Navigation functionality for Фикс.бел website - Mobile Menu Implementation
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (!mobileMenuBtn || !mobileMenu) {
        return;
    }
    
    let isMenuOpen = false;
    
    // Функция открытия меню
    function openMenu() {
        mobileMenu.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
    }
    
    // Функция закрытия меню
    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
    }
    
    // Клик по кнопке меню
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Клик по кнопке закрытия
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }
    
    // Клик по ссылкам меню
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = link.getAttribute('href');
            
            // Если это якорная ссылка, делаем плавную прокрутку
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const elementOffset = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: elementOffset - (headerHeight + 20),
                        behavior: 'smooth'
                    });
                }
            }
            
            setTimeout(closeMenu, 300); // Закрываем меню с небольшой задержкой
        });
    });
    
    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
});