document.addEventListener('DOMContentLoaded', function () {
    // Initialize Vanta.js background effect
    const vantaEffect = VANTA.RINGS({
        el: "#hero-background",
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 100.00,
        minWidth: 100.00,
        scale: 0.12,
        scaleMobile: 0.12,

        // Appearance
        backgroundColor: 0x202428, // dark background
        color: 0x2563eb,           // ring color
        waveSpeed: 0.1,
        ringCount: 2,
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a, .cta-buttons a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Only prevent default for links that point to sections on this page
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Get the height of the fixed header
                    const headerHeight = document.querySelector('.fixed-header').offsetHeight;

                    // Calculate the target scroll position
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');

                    // Update active link
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY + 150; // Offset to account for header height

        // Get all sections
        const sections = document.querySelectorAll('section[id]');

        // Find which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to corresponding nav link
                const targetLink = document.querySelector(`nav a[href="#${section.id}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        });
    });

    // FAQ accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');

            header.addEventListener('click', function () {
                // Close all other items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // In a real implementation, you would send the form data to a server
            // For demonstration purposes, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}); 
