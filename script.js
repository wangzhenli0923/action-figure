// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initHeaderScroll();
    initMobileMenu();
    initCopyButtons();
    initLikeButtons();
    initOrderModal();
});

// 头部滚动效果
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // 添加滚动类
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    menuBtn.addEventListener('click', () => {
        navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
        
        // 切换菜单按钮动画
        const spans = menuBtn.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });
}

// 复制提示文本
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promptText = this.previousElementSibling.textContent;
            navigator.clipboard.writeText(promptText)
                .then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    });
}

// 点赞功能
function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.gallery-card');
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    });

    dislikeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.gallery-card');
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// 图片加载优化
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});

// 平滑滚动
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

// Fade in animation for cards
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.tutorial-card, .prompt-card, .gallery-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
});

// Get DOM elements
const modal = document.getElementById('orderModal');
const orderButtons = document.querySelectorAll('.order-btn');
const closeButton = document.querySelector('.close');
const orderForm = document.getElementById('orderForm');
const selectedPlanInput = document.getElementById('selectedPlan');
const packageSelect = document.getElementById('style');
const physicalDetailsGroup = document.getElementById('physicalDetailsGroup');

// Open modal when clicking order buttons
orderButtons.forEach(button => {
    button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        selectedPlanInput.value = plan;
        packageSelect.value = plan;
        modal.style.display = 'block';
        
        // Show/hide physical details based on package type
        togglePhysicalDetails(plan);
    });
});

// Close modal when clicking (X) button
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Handle package selection change
packageSelect.addEventListener('change', function() {
    const selectedPlan = this.value;
    togglePhysicalDetails(selectedPlan);
});

// Toggle physical details visibility
function togglePhysicalDetails(plan) {
    if (plan === 'digital') {
        physicalDetailsGroup.style.display = 'none';
        // Remove required attribute from physical fields
        document.getElementById('phone').removeAttribute('required');
        document.getElementById('country').removeAttribute('required');
        document.getElementById('shipping').removeAttribute('required');
    } else {
        physicalDetailsGroup.style.display = 'block';
        // Add required attribute to physical fields
        document.getElementById('phone').setAttribute('required', '');
        document.getElementById('country').setAttribute('required', '');
        document.getElementById('shipping').setAttribute('required', '');
    }
}

// Form submission handling
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic form validation
    const requiredFields = orderForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    const submitButton = orderForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Form submission using FormSpree
    const formData = new FormData(orderForm);
    
    fetch(orderForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            // Success message
            alert('Thank you for your order! We will process it shortly.');
            modal.style.display = 'none';
            orderForm.reset();
        } else {
            // Error message
            alert('There was an error submitting your order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again.');
    })
    .finally(() => {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
}); 