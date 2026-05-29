document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (Drawer logic)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('hidden');
        mobileDrawerOverlay.classList.remove('hidden');
        
        // Small delay to allow display:block to apply before animating opacity/transform
        setTimeout(() => {
            mobileDrawer.classList.remove('translate-x-full');
            mobileDrawer.classList.add('translate-x-0');
            mobileDrawerOverlay.classList.remove('opacity-0');
            mobileDrawerOverlay.classList.add('opacity-100');
            mobileDrawerOverlay.classList.remove('pointer-events-none');
        }, 10);
    }

    function closeDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('translate-x-0');
        mobileDrawer.classList.add('translate-x-full');
        mobileDrawerOverlay.classList.remove('opacity-100');
        mobileDrawerOverlay.classList.add('opacity-0');
        mobileDrawerOverlay.classList.add('pointer-events-none');
        
        // Wait for animation to finish before hiding
        setTimeout(() => {
            mobileDrawer.classList.add('hidden');
            mobileDrawerOverlay.classList.add('hidden');
        }, 400); // Matches transition duration
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);
    
    // Close drawer when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Parallax Mouse Movement
    const parallaxItems = document.querySelectorAll('.parallax-item');
    if (parallaxItems.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            parallaxItems.forEach(item => {
                const speed = item.getAttribute('data-speed') || 0.05;
                const xOffset = x * speed * 100;
                const yOffset = y * speed * 100;
                
                // shape-1 has an existing rotate(15deg) in CSS, we need to preserve it if possible.
                // But for simplicity, we just apply the translate here. The rotate can be handled by an inner div or we can just append it.
                let transformStr = `translate(${xOffset}px, ${yOffset}px)`;
                if (item.classList.contains('shape-1')) {
                    transformStr += ' rotate(15deg)';
                }
                
                item.style.transform = transformStr;
            });
        });
    }

    // AR Scanner Animation
    const scannerContainer = document.getElementById('scanner-container');
    const arObject = document.getElementById('ar-object');
    const scanStatus = document.getElementById('scan-status');

    if (scannerContainer && arObject && scanStatus) {
        const objects = ['🦖', '🪐', '💎', '🍔', '🏛️']; // Extended object list
        let currentObjIndex = 0;

        setInterval(() => {
            // Hide current object and reset to scanning
            arObject.classList.remove('show');
            arObject.classList.add('hide');
            scannerContainer.classList.remove('scanning-active');
            scanStatus.innerText = 'SCANNING...';
            scanStatus.classList.add('animate-pulse');

            setTimeout(() => {
                // Change object
                currentObjIndex = (currentObjIndex + 1) % objects.length;
                arObject.innerText = objects[currentObjIndex];
                
                // Show new object
                scannerContainer.classList.add('scanning-active');
                arObject.classList.remove('hide');
                arObject.classList.add('show');
                scanStatus.innerText = 'OBJECT DETECTED';
                scanStatus.classList.remove('animate-pulse');
            }, 1200); // Wait 1.2s while scanning before showing next object

        }, 4000); // Cycle every 4 seconds
    }

    // Feedback Form Submission
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Submitting...';
            submitBtn.disabled = true;

            // Collect data
            const formData = new FormData(feedbackForm);
            
            /* 
             * ==========================================
             * TO CONNECT TO GOOGLE SHEETS:
             * 1. Go to Google Sheets -> Extensions -> Apps Script
             * 2. Paste a basic doPost(e) script to append rows.
             * 3. Deploy as Web App (Anyone can access).
             * 4. Paste the Web App URL below:
             * ==========================================
             */
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzI83j2mqkgRivL0bLLlfG5XITGor8BLIWgJsAUBc-Qf0Mik6nKRzQND1-zxV33V6Y5Wg/exec';

            // Check if URL is configured
            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
                setTimeout(() => {
                    alert('Feedback saved locally! (To connect to Google Sheets, update the GOOGLE_SCRIPT_URL in script.js)');
                    feedbackForm.reset();
                    submitBtn.innerText = 'Feedback Sent!';
                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1000);
                return;
            }

            const data = {
                name: document.getElementById("name").value,
                feedback: document.querySelector('input[name="rating"]:checked').value,
                message: document.getElementById("message").value
            };

            // Actual fetch call for Google Sheets
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Added for Google Apps Script redirects
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                feedbackForm.reset();
                submitBtn.innerText = 'Feedback Sent Successfully!';
                alert("Feedback Submitted Successfully!");
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.innerText = 'Error! Try Again.';
                alert("Something Went Wrong!");
            })
            .finally(() => {
                setTimeout(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
});
