// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const header = document.querySelector('.header');
    let lastScroll = 0;

    // Handle header scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
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

    // Like/Dislike functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const count = this.querySelector('.count');
            let value = parseInt(count.textContent);
            count.textContent = value + 1;
            this.classList.add('active');
        });
    });

    dislikeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const count = this.querySelector('.count');
            let value = parseInt(count.textContent);
            count.textContent = value + 1;
            this.classList.add('active');
        });
    });

    // Copy prompt functionality
    const copyButtons = document.querySelectorAll('.copy-prompt');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            navigator.clipboard.writeText(prompt).then(() => {
                // Show success message
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Lazy loading images
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));
}); 