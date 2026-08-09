// DOM Elements
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const backToTopBtn = document.getElementById('back-to-top');
const yearSpan = document.getElementById('year');
const reveals = document.querySelectorAll('.reveal');
const typingText = document.querySelector('.typing-text');

// 1. Theme Toggle Logic
// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
} else {
    // If no saved theme, prefer dark
    document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggleBtn.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
});

// 2. Mobile Menu (Hamburger)
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Prevent body scrolling when menu is open
    if (navLinks.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = 'auto';
    });
});

// 3. Set Current Year in Footer
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// 4. Scroll Reveal Animations (Intersection Observer)
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealObserver.observe(reveal);
});

// 5. Active Link Highlighting on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // 150px offset to trigger slightly before the section reaches the top
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // 6. Back to Top Button Visibility
    if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// Back to Top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 7. Contact Form Mailto Fallback
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const statusDiv = document.getElementById('form-status');
        
        if (!name || !email || !message) {
            statusDiv.textContent = "Please fill in all fields.";
            statusDiv.className = "form-status error";
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            statusDiv.textContent = "Please enter a valid email address.";
            statusDiv.className = "form-status error";
            return;
        }

        // Construct mailto link
        const recipient = "hamzaidentityoghi@gmail.com";
        const subject = `Portfolio Contact from ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        
        // Open default mail client
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        
        statusDiv.textContent = "Opening your mail client...";
        statusDiv.className = "form-status success";
        
        // Reset form
        setTimeout(() => {
            contactForm.reset();
            statusDiv.textContent = "";
            statusDiv.className = "form-status";
        }, 3000);
    });
}

// 8. Simple Typewriter Effect for Hero (Optional but requested)
const roles = ["Machine Learning & BI", "Data Analytics", "AI Development"];
let roleIndex = 0;
let charIndex = roles[0].length;
let isDeleting = true;

function typeWriter() {
    if (!typingText) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Move to next role
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

// Initialize typewriter after a short delay
setTimeout(typeWriter, 1500);
