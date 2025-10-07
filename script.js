// Функциональность сворачивания/разворачивания бокового меню
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item:not(#mobileMenuBtn)');
    
    // Проверяем сохраненное состояние меню (только для десктопа)
    if (window.innerWidth > 768) {
        const sidebarState = localStorage.getItem('sidebarState');
        if (sidebarState === 'collapsed') {
            sidebar.classList.add('collapsed');
        }
    } else {
        // На мобильном убираем класс collapsed если он есть
        sidebar.classList.remove('collapsed');
    }
    
    // Обработчик для десктопной кнопки меню
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Только для десктопа
            if (window.innerWidth > 768) {
                sidebar.classList.toggle('collapsed');
                
                // Сохраняем состояние в localStorage
                if (sidebar.classList.contains('collapsed')) {
                    localStorage.setItem('sidebarState', 'collapsed');
                } else {
                    localStorage.setItem('sidebarState', 'expanded');
                }
                
                // Анимация иконки гамбургера
                this.classList.toggle('active');
            }
        });
    }
    
    // Обработчик для мобильной кнопки меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // На мобильном убираем collapsed и добавляем active
            sidebar.classList.remove('collapsed');
            sidebar.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Обработчик для кнопки закрытия в сайдбаре
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Закрытие меню при клике на overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Закрытие меню при клике на ссылку в сайдбаре (мобильная версия)
    if (window.innerWidth <= 768) {
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Активация пункта мобильной навигации
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== 'reg') {
                e.preventDefault();
            }
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Обработка изменения размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                // Десктоп
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Восстанавливаем состояние из localStorage
                const sidebarState = localStorage.getItem('sidebarState');
                if (sidebarState === 'collapsed') {
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('collapsed');
                }
            } else {
                // Мобильный - убираем collapsed
                sidebar.classList.remove('collapsed');
            }
        }, 250);
    });
    
    // Плавная прокрутка для всех ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Добавление эффекта при прокрутке для шапки
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Прокрутка вниз
            header.style.transform = 'translateY(-100%)';
        } else {
            // Прокрутка вверх
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Анимация появления карточек игр при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Применяем наблюдатель ко всем карточкам игр
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.05}s`;
        observer.observe(card);
    });
    
    // Добавление эффекта наведения для навигации
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Инициализация подсказок (tooltips) для свернутого меню
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (sidebar.classList.contains('collapsed')) {
                const text = this.querySelector('span:not(.icon)');
                if (text && text.textContent.trim()) {
                    this.setAttribute('data-tooltip', text.textContent);
                    this.classList.add('show-tooltip');
                }
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('show-tooltip');
        });
    });
    
    // Добавление стилей для tooltip
    const style = document.createElement('style');
    style.textContent = `
        .sidebar-link[data-tooltip] {
            position: relative;
        }
        
        .sidebar-link.show-tooltip::after {
            content: attr(data-tooltip);
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            white-space: nowrap;
            margin-left: 10px;
            font-size: 13px;
            z-index: 1000;
            animation: tooltipFadeIn 0.2s ease;
        }
        
        @keyframes tooltipFadeIn {
            from {
                opacity: 0;
                transform: translateY(-50%) translateX(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(-50%) translateX(0);
            }
        }
        
        .header {
            transition: transform 0.3s ease;
        }
        
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);
    
    // Добавление функции загрузки изображений с fallback
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Создаем placeholder вместо несуществующего изображения
            const placeholder = document.createElement('div');
            placeholder.style.width = '100%';
            placeholder.style.height = '100%';
            placeholder.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.fontSize = '48px';
            placeholder.textContent = '🎮';
            
            this.parentNode.insertBefore(placeholder, this);
            this.style.display = 'none';
        });
    });
    
    console.log('Игровой сайт загружен успешно!');
});