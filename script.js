document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation Logic
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and contents
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding tab content
            const targetId = link.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Close mobile menu if open
            navLinks.classList.remove('active');
        });
    });

    // Mobile Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Modal Logic
    const modal = document.getElementById('loginModal');
    const wifiBtn = document.getElementById('wifiBtn');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');

    // Open Modal
    wifiBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close Modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Handle Form Submission (Prevent Default for now)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state to simulate loading
        const submitBtn = loginForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        
        // Simulate network request
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Connected!';
            submitBtn.style.backgroundColor = 'var(--accent-green)';
            
            // Close modal after brief delay
            setTimeout(() => {
                modal.classList.remove('show');
                // Reset form and button state
                loginForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
            }, 1500);
        }, 2000);
    });
});
