// Main JavaScript for TechPulse Website
(function() {
    'use strict';

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeWebsite();
    });

    // Initialize all website functionality
    function initializeWebsite() {
        initNavigation();
        initScrollEffects();
        initAnimations();
        initForms();
        initMobileMenu();
        initTooltips();
        initSmoothScrolling();
        initImageLazyLoading();
        initNewsletterForm();
        initScrollToTop();
    }

    // Navigation functionality
    function initNavigation() {
        const header = document.querySelector('header');
        const navLinks = document.querySelectorAll('.nav-links a');

        // Header scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Active navigation highlighting
        function setActiveNav() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentPage || 
                    (currentPage === '' && link.getAttribute('href') === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }

        setActiveNav();
    }

    // Scroll effects and animations
    function initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.scroll-animate, .reveal-on-scroll, .article-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                hero.style.transform = `translateY(${parallax}px)`;
            });
        }
    }

    // Initialize animations
    function initAnimations() {
        // Stagger animation for cards
        const articleCards = document.querySelectorAll('.article-card');
        articleCards.forEach((card, index) => {
            card.style.setProperty('--index', index);
            card.classList.add('animate-fade-in-up');
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Counter animation for stats
        const statNumbers = document.querySelectorAll('.stat-number');
        const animateCounters = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        stat.textContent = Math.ceil(current).toLocaleString() + stat.textContent.replace(/[\d,]/g, '');
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                updateCounter();
            });
        };

        // Trigger counter animation when stats section is visible
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        statsObserver.unobserve(entry.target);
                    }
                });
            });
            statsObserver.observe(statsSection);
        }
    }

    // Form handling
    function initForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add focus animations to form fields
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });
            });

            // Form submission handling
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmission(this);
            });
        });
    }

    // Handle form submissions
    function handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 2000);
    }

    // Mobile menu functionality
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navLinks.classList.toggle('mobile-active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking on a link
            const navLinkItems = navLinks.querySelectorAll('a');
            navLinkItems.forEach(link => {
                link.addEventListener('click', function() {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('mobile-active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }

    // Tooltip functionality
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                showTooltip(this, this.getAttribute('data-tooltip'));
            });
            
            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    // Show tooltip
    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        tooltip.classList.add('show');
    }

    // Hide tooltip
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Image lazy loading
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Newsletter form handling
    function initNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                
                if (validateEmail(email)) {
                    showNotification('Thank you for subscribing!', 'success');
                    this.reset();
                } else {
                    showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Scroll to top functionality
    function initScrollToTop() {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollTopBtn);
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                hideNotification(notification);
            }
        }, 5000);
    }

    // Hide notification
    function hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Search functionality (for blog pages)
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.toLowerCase().trim();
                
                if (query.length < 2) {
                    hideSearchResults();
                    return;
                }
                
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            });
        }
    }

    // Perform search (mock implementation)
    function performSearch(query) {
        // This would typically make an API call
        // For now, we'll simulate search results
        const mockResults = [
            { title: 'AI Applications in Healthcare', url: 'articles/ai-healthcare.html' },
            { title: 'Web Development Best Practices', url: 'articles/web-best-practices.html' },
            { title: 'Cybersecurity Trends 2025', url: 'articles/cybersecurity-trends.html' }
        ].filter(result => result.title.toLowerCase().includes(query));
        
        displaySearchResults(mockResults);
    }

    // Display search results
    function displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
        } else {
            searchResults.innerHTML = results.map(result => 
                `<a href="${result.url}" class="search-result-item">${result.title}</a>`
            ).join('');
        }
        
        searchResults.classList.add('show');
    }

    // Hide search results
    function hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.classList.remove('show');
        }
    }

    // Theme switcher (dark/light mode)
    function initThemeSwitcher() {
        const themeSwitcher = document.getElementById('themeSwitcher');
        
        if (themeSwitcher) {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);
            
            themeSwitcher.addEventListener('click', function() {
                const currentTheme = document.body.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    // Set theme
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const themeSwitcher = document.getElementById('themeSwitcher');
        if (themeSwitcher) {
            themeSwitcher.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    // Reading progress indicator
    function initReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Utility functions
    function getRandomColor() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Copied to clipboard!', 'success');
        }).catch(function() {
            showNotification('Failed to copy to clipboard', 'error');
        });
    }

    // Social sharing
    function initSocialSharing() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareUrl;
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    default:
                        return;
                }
                
                window.open(shareUrl, '_blank', 'width=600,height=400');
            });
        });
    }

    // Keyboard navigation
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // ESC key to close modals/menus
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                const activeMobileMenu = document.querySelector('.nav-links.mobile-active');
                
                if (activeModal) {
                    closeModal(activeModal);
                }
                
                if (activeMobileMenu) {
                    const mobileToggle = document.querySelector('.mobile-menu-toggle');
                    mobileToggle.click();
                }
            }
        });
    }

    // Initialize additional features for specific pages
    if (window.location.pathname.includes('blog')) {
        initSearch();
    }

    if (window.location.pathname.includes('article')) {
        initReadingProgress();
        initSocialSharing();
    }

    // Global error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Optionally show user-friendly error message
    });

    // Export functions for global use
    window.TechPulse = {
        showNotification,
        copyToClipboard,
        formatDate,
        validateEmail
    };

})();