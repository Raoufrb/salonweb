
// Filter services by gender
const genderTabs = document.querySelectorAll('.gender-tab');
genderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        genderTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const gender = tab.dataset.gender;
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            if (gender === 'all' || card.dataset.gender === gender) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Filter services by category
const categoryBtns = document.querySelectorAll('.category-btn');
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Login button functionality
document.querySelector('.login-btn').addEventListener('click', () => {
    window.location.href = 'login.html';
});

// Book button functionality
document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Vous allez être redirigé vers notre système de réservation. Connectez-vous pour continuer.');
        window.location.href = 'login.html';
    });
});

// CTA button functionality
document.querySelector('.cta-btn').addEventListener('click', () => {
    alert('Découvrez nos disponibilités et réservez votre créneau en ligne.');
    window.location.href = 'login.html';
});
