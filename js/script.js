/**
 * VIKAS KUMAR - PORTFOLIO SCRIPTS
 * Modern JavaScript with ES6+ features
 * Vanilla JS - No dependencies required
 */

(function() {
    'use strict';

    /* ============================================
       CONFIGURATION
       ============================================ */
    const CONFIG = {
        typingSpeed: 100,
        typingDelay: 2000,
        scrollRevealThreshold: 0.15,
        headerScrollThreshold: 100,
        scrollTopThreshold: 400,
        counterDuration: 2000,
        animationDelay: 100
    };

    /* ============================================
       DOM ELEMENTS
       ============================================ */
    const DOM = {
        loader: document.getElementById('loader'),
        header: document.getElementById('header'),
        navMenu: document.getElementById('nav-menu'),
        navToggle: document.getElementById('nav-toggle'),
        navLinks: document.querySelectorAll('.nav-link'),
        themeToggle: document.getElementById('theme-toggle'),
        typedText: document.getElementById('typed-text'),
        scrollTop: document.getElementById('scroll-top'),
        contactForm: document.getElementById('contact-form'),
        formStatus: document.getElementById('form-status'),
        currentYear: document.getElementById('current-year'),
        revealElements: document.querySelectorAll('.reveal'),
        statNumbers: document.querySelectorAll('.stat-number'),
        sections: document.querySelectorAll('section[id]')
    };

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */
    const Utils = {
        debounce(func, wait = 10) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle(func, limit = 100) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        isInViewport(element, threshold = 0) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
        },

        getLocalStorage(key, defaultValue) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },

        setLocalStorage(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available');
            }
        }
    };

    /* ============================================
       LOADER
       ============================================ */
    const Loader = {
        init() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    DOM.loader.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 500);
            });

            document.body.style.overflow = 'hidden';
        }
    };

    /* ============================================
       HEADER & NAVIGATION
       ============================================ */
    const Navigation = {
        init() {
            this.handleScroll();
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupActiveNavHighlight();
            this.setupKeyboardNavigation();
        },

        handleScroll() {
            const onScroll = Utils.throttle(() => {
                const scrollY = window.scrollY;

                if (scrollY > CONFIG.headerScrollThreshold) {
                    DOM.header.classList.add('scrolled');
                } else {
                    DOM.header.classList.remove('scrolled');
                }
            }, 50);

            window.addEventListener('scroll', onScroll, { passive: true });
        },

        setupMobileMenu() {
            if (!DOM.navToggle) return;

            DOM.navToggle.addEventListener('click', () => {
                const isExpanded = DOM.navToggle.getAttribute('aria-expanded') === 'true';
                DOM.navToggle.setAttribute('aria-expanded', !isExpanded);
                DOM.navMenu.classList.toggle('active');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    DOM.navToggle.setAttribute('aria-expanded', 'false');
                    DOM.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', (e) => {
                if (!DOM.header.contains(e.target) && DOM.navMenu.classList.contains('active')) {
                    DOM.navToggle.setAttribute('aria-expanded', 'false');
                    DOM.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        const headerHeight = DOM.header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupActiveNavHighlight() {
            const highlightNav = Utils.throttle(() => {
                const scrollY = window.scrollY;

                DOM.sections.forEach(section => {
                    const sectionHeight = section.offsetHeight;
                    const sectionTop = section.offsetTop - 100;
                    const sectionId = section.getAttribute('id');

                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        DOM.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, 100);

            window.addEventListener('scroll', highlightNav, { passive: true });
        },

        setupKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
                    DOM.navToggle.setAttribute('aria-expanded', 'false');
                    DOM.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    DOM.navToggle.focus();
                }
            });
        }
    };

    /* ============================================
       DARK MODE
       ============================================ */
    const DarkMode = {
        init() {
            this.setTheme(this.getPreferredTheme());
            this.setupToggle();
        },

        getPreferredTheme() {
            const savedTheme = Utils.getLocalStorage('theme', null);
            if (savedTheme) return savedTheme;

            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            Utils.setLocalStorage('theme', theme);
        },

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        },

        setupToggle() {
            if (!DOM.themeToggle) return;

            DOM.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!Utils.getLocalStorage('theme', null)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    };

    /* ============================================
       TYPING ANIMATION
       ============================================ */
    const TypingAnimation = {
        strings: [
            'Frontend Developer',
            'UI/UX Enthusiast',
            'Problem Solver',
            'Creative Coder',
            'Web Developer'
        ],
        currentStringIndex: 0,
        currentCharIndex: 0,
        isDeleting: false,
        timeoutId: null,

        init() {
            if (!DOM.typedText) return;
            this.type();
        },

        type() {
            const currentString = this.strings[this.currentStringIndex];

            if (this.isDeleting) {
                DOM.typedText.textContent = currentString.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                DOM.typedText.textContent = currentString.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
            }

            let typeSpeed = CONFIG.typingSpeed;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.currentCharIndex === currentString.length) {
                typeSpeed = CONFIG.typingDelay;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentStringIndex = (this.currentStringIndex + 1) % this.strings.length;
                typeSpeed = CONFIG.typingSpeed;
            }

            this.timeoutId = setTimeout(() => this.type(), typeSpeed);
        },

        destroy() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
        }
    };

    /* ============================================
       SCROLL REVEAL ANIMATION
       ============================================ */
    const ScrollReveal = {
        init() {
            this.reveal();
            window.addEventListener('scroll', Utils.throttle(() => this.reveal(), 50), { passive: true });
        },

        reveal() {
            DOM.revealElements.forEach((element, index) => {
                if (Utils.isInViewport(element, CONFIG.scrollRevealThreshold)) {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, index * CONFIG.animationDelay);
                }
            });
        }
    };

    /* ============================================
       ANIMATED COUNTERS
       ============================================ */
    const AnimatedCounters = {
        animated: new Set(),

        init() {
            this.observeCounters();
        },

        observeCounters() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            DOM.statNumbers.forEach(counter => observer.observe(counter));
        },

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'), 10);
            const duration = CONFIG.counterDuration;
            const start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(start + (target - start) * easeOutQuad);

                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    /* ============================================
       SCROLL TO TOP
       ============================================ */
    const ScrollToTop = {
        init() {
            this.handleScroll();
            this.setupClick();
        },

        handleScroll() {
            const onScroll = Utils.throttle(() => {
                if (window.scrollY > CONFIG.scrollTopThreshold) {
                    DOM.scrollTop.removeAttribute('hidden');
                } else {
                    DOM.scrollTop.setAttribute('hidden', '');
                }
            }, 100);

            window.addEventListener('scroll', onScroll, { passive: true });
        },

        setupClick() {
            if (!DOM.scrollTop) return;

            DOM.scrollTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    /* ============================================
       CONTACT FORM
       ============================================ */

const ContactForm = {

    init() {

        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener("submit", this.handleSubmit.bind(this));

    },

    validateField(input) {

        if (input.value.trim() === "") {

            input.focus();

            return false;

        }

        return true;

    },

    handleSubmit(e) {

        e.preventDefault();

        const inputs = DOM.contactForm.querySelectorAll(".form-input");

        for (const input of inputs) {

            if (!this.validateField(input)) return;

        }

        const submitButton = DOM.contactForm.querySelector(".form-submit");

        submitButton.disabled = true;

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const subject = document.getElementById("subject").value.trim();

        const message = document.getElementById("message").value.trim();

        const phone = "916299873334";

        const text = `*New Portfolio Lead*

👤 Name: ${name}

📧 Email: ${email}

📌 Subject: ${subject}

💬 Message:
${message}`;

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
            "_blank"
        );

        DOM.contactForm.reset();

        submitButton.disabled = false;

    }

};

    /* ============================================
       FOOTER
       ============================================ */
    const Footer = {
        init() {
            if (DOM.currentYear) {
                DOM.currentYear.textContent = new Date().getFullYear();
            }
        }
    };

    /* ============================================
       ACCESSIBILITY
       ============================================ */
    const Accessibility = {
        init() {
            this.setupSkipLink();
            this.setupFocusManagement();
            this.announcePageChanges();
        },

        setupSkipLink() {
            const skipLink = document.createElement('a');
            skipLink.href = '#hero';
            skipLink.className = 'sr-only';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: fixed;
                top: -100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 1rem 2rem;
                background: var(--color-primary);
                color: white;
                z-index: 9999;
                border-radius: 0 0 8px 8px;
                transition: top 0.3s;
            `;

            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '0';
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-100%';
            });

            document.body.insertBefore(skipLink, document.body.firstChild);
        },

        setupFocusManagement() {
            const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },

        announcePageChanges() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.id) {
                        const sectionTitle = entry.target.querySelector('.section-title');
                        if (sectionTitle) {
                            this.announceToScreenReader(
                                `Now viewing: ${sectionTitle.textContent}`
                            );
                        }
                    }
                });
            }, { threshold: 0.5 });

            DOM.sections.forEach(section => observer.observe(section));
        },

        announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = message;

            document.body.appendChild(announcement);

            setTimeout(() => {
                announcement.remove();
            }, 1000);
        }
    };

    /* ============================================
       PERFORMANCE OPTIMIZATIONS
       ============================================ */
    const Performance = {
        init() {
            this.lazyLoadImages();
            this.preloadCriticalAssets();
        },

        lazyLoadImages() {
            const images = document.querySelectorAll('img[loading="lazy"]');

            if ('loading' in HTMLImageElement.prototype) {
                return;
            }

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        },

        preloadCriticalAssets() {
            const heroImage = document.querySelector('.hero-image-wrapper img');
            if (heroImage && !heroImage.complete) {
                heroImage.addEventListener('load', () => {
                    heroImage.style.opacity = '1';
                });
            }
        }
    };

    /* ============================================
       INITIALIZE APPLICATION
       ============================================ */
    function init() {
        Loader.init();
        Navigation.init();
        DarkMode.init();
        TypingAnimation.init();
        ScrollReveal.init();
        AnimatedCounters.init();
        ScrollToTop.init();
        ContactForm.init();
        Footer.init();
        Accessibility.init();
        Performance.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('beforeunload', () => {
        TypingAnimation.destroy();
    });

})();
