document.addEventListener('DOMContentLoaded', function () {
    // Audio waveform background
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let startTime = null;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const waves = [
            { cFreq: 14, eFreq: 1.8, amp: 28, cSpeed: 3.0, eSpeed: 0.4, cPhase: 0.0, ePhase: 0.0, yFrac: 0.32, opacity: 0.14 },
            { cFreq:  9, eFreq: 2.5, amp: 22, cSpeed: 2.2, eSpeed: 0.6, cPhase: 2.1, ePhase: 1.5, yFrac: 0.50, opacity: 0.12 },
            { cFreq: 18, eFreq: 1.2, amp: 16, cSpeed: 3.8, eSpeed: 0.3, cPhase: 4.4, ePhase: 3.0, yFrac: 0.68, opacity: 0.11 },
            { cFreq: 11, eFreq: 3.1, amp: 20, cSpeed: 2.7, eSpeed: 0.5, cPhase: 1.3, ePhase: 4.2, yFrac: 0.41, opacity: 0.09 },
            { cFreq: 22, eFreq: 0.9, amp: 12, cSpeed: 4.5, eSpeed: 0.2, cPhase: 3.7, ePhase: 1.8, yFrac: 0.59, opacity: 0.08 },
        ];
        const TAU = Math.PI * 2;

        function draw(timestamp) {
            if (!startTime) startTime = timestamp;
            const t = (timestamp - startTime) / 1000;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            waves.forEach(w => {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(180, 210, 255, ${w.opacity})`;
                ctx.lineWidth = 1.5;
                const baseY = canvas.height * w.yFrac;
                for (let x = 0; x <= canvas.width; x++) {
                    const xr = x / canvas.width;
                    const envelope = 0.5 + 0.5 * Math.sin(xr * TAU * w.eFreq + t * w.eSpeed + w.ePhase);
                    const y = baseY + Math.sin(xr * TAU * w.cFreq + t * w.cSpeed + w.cPhase) * w.amp * envelope;
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            const baseY = canvas.height * 0.88;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(180, 210, 255, 0.28)';
            ctx.lineWidth = 1.5;

            // Combined waveform — harmonics drift independently (like real audio content changing)
            // Each harmonic also has a slow random-walk on its amplitude via two offset sine modulators,
            // so the energy in each frequency band rises and falls unpredictably rather than cyclically.
            const harmonics = [
                { freq:  4.7, amp: 11, speed: 1.1, phase: 0.0, r1: 0.13, r2: 0.07, rp1: 0.0, rp2: 1.9 },
                { freq:  9.3, amp:  8, speed: 2.3, phase: 1.7, r1: 0.17, r2: 0.11, rp1: 3.1, rp2: 0.7 },
                { freq: 14.1, amp:  6, speed: 3.7, phase: 3.3, r1: 0.09, r2: 0.19, rp1: 1.4, rp2: 4.2 },
                { freq: 21.6, amp:  4, speed: 5.2, phase: 0.9, r1: 0.21, r2: 0.08, rp1: 5.5, rp2: 2.3 },
                { freq: 31.4, amp:  3, speed: 7.1, phase: 2.1, r1: 0.14, r2: 0.23, rp1: 2.8, rp2: 0.4 },
                { freq:  7.8, amp:  7, speed: 1.8, phase: 4.5, r1: 0.19, r2: 0.10, rp1: 0.6, rp2: 3.8 },
                { freq: 18.3, amp:  4, speed: 4.4, phase: 5.8, r1: 0.08, r2: 0.16, rp1: 4.0, rp2: 1.1 },
                { freq: 27.9, amp:  3, speed: 6.3, phase: 1.2, r1: 0.22, r2: 0.12, rp1: 1.7, rp2: 5.0 },
                { freq: 43.2, amp:  2, speed: 9.0, phase: 3.7, r1: 0.11, r2: 0.20, rp1: 3.3, rp2: 2.6 },
                { freq: 12.7, amp:  5, speed: 2.9, phase: 0.4, r1: 0.16, r2: 0.09, rp1: 5.1, rp2: 0.9 },
            ];
            for (let x = 0; x <= canvas.width; x++) {
                const xr = x / canvas.width;
                let dy = 0;
                harmonics.forEach(h => {
                    // Two slow, incommensurable modulators per harmonic → aperiodic amplitude variation
                    const mod = 0.5 + 0.4 * Math.sin(t * h.r1 + h.rp1) + 0.1 * Math.sin(t * h.r2 + h.rp2);
                    dy += Math.sin(xr * TAU * h.freq + t * h.speed + h.phase) * h.amp * mod;
                });
                const y = baseY + dy;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }

            ctx.stroke();
            requestAnimationFrame(draw);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        requestAnimationFrame(draw);
    }


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
