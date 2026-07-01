/**
 * AARAMBH 6.0 - TEAM RECRUITMENT WEBSITE
 * JavaScript Functionality
 * Features:
 * - Particle Background Animation
 * - Sticky Navbar with scroll behavior
 * - Mobile Hamburger Menu
 * - Smooth Scroll Navigation
 * - Scroll Reveal Animations (Intersection Observer)
 * - Form Validation
 * - Form Submission with Loading State & Success Modal
 * - Google Sheets Integration (commented webhook example)
 */

// =========================================
// PARTICLE BACKGROUND SYSTEM
// =========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
const CONNECTION_DISTANCE = 120;
const MOUSE_DISTANCE = 150;

let mouse = { x: null, y: null };

// Handle canvas resize
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse for interactive particles
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        // Neon blue or purple color
        this.color = Math.random() > 0.5 ? 'rgba(0, 212, 255,' : 'rgba(184, 41, 221,';
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction - gentle repulsion
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_DISTANCE) {
                const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
                this.vx -= (dx / distance) * force * 0.02;
                this.vy -= (dy / distance) * force * 0.02;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
                const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// =========================================
// STICKY NAVBAR
// =========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});


// =========================================
// MOBILE HAMBURGER MENU
// =========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});


// =========================================
// SCROLL REVEAL ANIMATIONS
// =========================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: stop observing once revealed
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// =========================================
// FORM VALIDATION & SUBMISSION
// =========================================
const form = document.getElementById('recruitment-form');
const submitBtn = document.getElementById('submit-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

// Form field elements
const fields = {
    fullname: document.getElementById('fullname'),
    phone: document.getElementById('phone'),
    email: document.getElementById('email'),
    department: document.getElementById('department'),
    year: document.getElementById('year'),
    team: document.getElementById('team'),
    position: document.getElementById('position'),
    reason: document.getElementById('reason'),
    experience: document.getElementById('experience')
};

// Error message elements
const errors = {
    fullname: document.getElementById('error-fullname'),
    phone: document.getElementById('error-phone'),
    email: document.getElementById('error-email'),
    department: document.getElementById('error-department'),
    year: document.getElementById('error-year'),
    team: document.getElementById('error-team'),
    position: document.getElementById('error-position'),
    reason: document.getElementById('error-reason')
};

// Validation Rules
function validateField(name, value) {
    switch (name) {
        case 'fullname':
            if (!value.trim()) return 'Full name is required';
            if (value.trim().length < 3) return 'Name must be at least 3 characters';
            return '';

        case 'phone':
            if (!value.trim()) return 'Phone number is required';
            // Allow digits, spaces, +, -, ()
            const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Enter a valid phone number (min 10 digits)';
            return '';

        case 'email':
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Enter a valid email address';
            return '';

        case 'department':
            if (!value.trim()) return 'Department is required';
            return '';

        case 'year':
            if (!value) return 'Please select your year';
            return '';

        case 'team':
    if (!value) return 'Please select a team';
    return '';

case 'position':
    if (!value) return 'Please select a preferred position';
    return '';

        case 'reason':
            if (!value.trim()) return 'This field is required';
            if (value.trim().length < 20) return 'Please write at least 20 characters';
            return '';

        default:
            return '';
    }
}

// Show/Hide Error
function showError(fieldName, message) {
    const field = fields[fieldName];
    const error = errors[fieldName];

    if (message) {
        field.classList.add('error');
        error.textContent = message;
    } else {
        field.classList.remove('error');
        error.textContent = '';
    }
}

// Real-time validation on blur
Object.keys(fields).forEach(fieldName => {
    if (errors[fieldName]) {
        fields[fieldName].addEventListener('blur', () => {
            const error = validateField(fieldName, fields[fieldName].value);
            showError(fieldName, error);
        });

        // Clear error on input
        fields[fieldName].addEventListener('input', () => {
            if (fields[fieldName].classList.contains('error')) {
                const error = validateField(fieldName, fields[fieldName].value);
                showError(fieldName, error);
            }
        });
    }
});

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate all required fields
    const requiredFields = [
'fullname',
'phone',
'email',
'department',
'year',
'team',
'position',
'reason'
];
    requiredFields.forEach(fieldName => {
        const error = validateField(fieldName, fields[fieldName].value);
        showError(fieldName, error);
        if (error) isValid = false;
    });

    if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.form-group input.error, .form-group select.error, .form-group textarea.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Prepare form data
   const formData = {

fullname: fields.fullname.value.trim(),

phone: fields.phone.value.trim(),

email: fields.email.value.trim(),

department: fields.department.value.trim(),

year: fields.year.value,

team: fields.team.value,

position: fields.position.value,

reason: fields.reason.value.trim(),

experience: fields.experience.value.trim()

};

    // =========================================
    // OPTION 1: SIMULATE SUBMISSION (Demo)
    // =========================================
    // Uncomment the setTimeout block and comment out the fetch block for demo mode
    // setTimeout(() => {
    //     submitBtn.classList.remove('loading');
    //     submitBtn.disabled = false;
    //     showSuccessModal();
    //     form.reset();
    // }, 1500);

    // =========================================
    // OPTION 2: GOOGLE SHEETS INTEGRATION
    // =========================================
    // To save data to Google Sheets, follow these steps:
    // 1. Create a Google Sheet
    // 2. Go to Extensions > Apps Script
    // 3. Deploy as Web App (set access to 'Anyone')
    // 4. Replace the URL below with your Web App URL
    // 5. Ensure your Apps Script handles a POST request with these fields

    const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw58vd3ntCapMnBG5vW9lrIpg5WJrkdNa2sO4Fg34XhSnJDfsdMa2TyWoQGQPqvHHTO/exec';

try {

    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

    showSuccessModal();
    form.reset();

} catch (error) {

    console.error("Submission error:", error);

    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

    alert("Something went wrong. Please try again later.");
}

});


// =========================================
// SUCCESS MODAL
// =========================================
function showSuccessModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideSuccessModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', hideSuccessModal);

// Close modal on overlay click
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        hideSuccessModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        hideSuccessModal();
    }
});


// =========================================
// GOOGLE SHEETS SETUP GUIDE (For Reference)
// =========================================
/*
To integrate with Google Sheets, use this Apps Script code:

function doPost(e) {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
        new Date(),
        data.fullname,
        data.phone,
        data.email,
        data.department,
        data.year,
        data.role,
        data.reason,
        data.experience
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
}

Deploy this as a Web App with access set to 'Anyone' and paste the URL above.
*/

