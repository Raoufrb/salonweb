document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const rdvForm = document.getElementById('rdvForm');
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const notesTextarea = document.getElementById('notes');
    
    // Summary Elements
    const summaryService = document.getElementById('summary-service');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryTotal = document.getElementById('summary-total');
    
    // Service Prices
    const servicePrices = {
        'coupe-femme': 45,
        'coupe-homme': 30,
        'coloration': 65,
        'massage': 70,
        'soin-visage': 55,
        'manucure': 35,
        'pedicure': 45,
        'soin-barbe': 40
    };
    
    // Service Names
    const serviceNames = {
        'coupe-femme': 'Coupe Femme',
        'coupe-homme': 'Coupe Homme',
        'coloration': 'Coloration',
        'massage': 'Massage Relaxant',
        'soin-visage': 'Soin du Visage',
        'manucure': 'Manucure',
        'pedicure': 'Pédicure',
        'soin-barbe': 'Soin Barbe'
    };
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Update summary when form changes
    function updateSummary() {
        const serviceValue = serviceSelect.value;
        const dateValue = dateInput.value;
        const timeValue = timeSelect.value;
        
        if (serviceValue) {
            summaryService.textContent = serviceNames[serviceValue];
            summaryTotal.textContent = servicePrices[serviceValue] + '€';
        } else {
            summaryService.textContent = '-';
            summaryTotal.textContent = '0€';
        }
        
        summaryDate.textContent = dateValue ? formatDate(dateValue) : '-';
        summaryTime.textContent = timeValue || '-';
    }
    
    // Format date to French format
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    // Form submission
    rdvForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!serviceSelect.value || !dateInput.value || !timeSelect.value) {
            alert('Veuillez sélectionner un service, une date et une heure');
            return;
        }
        
        const rdvData = {
            service: serviceSelect.value,
            serviceName: serviceNames[serviceSelect.value],
            date: dateInput.value,
            time: timeSelect.value,
            notes: notesTextarea.value,
            price: servicePrices[serviceSelect.value]
        };
        
        // Here you would typically send the data to your backend
        console.log('RDV data:', rdvData);
        
        // For demo purposes, we'll just show an alert
        alert(`Rendez-vous confirmé pour ${serviceNames[serviceSelect.value]} le ${formatDate(dateInput.value)} à ${timeSelect.value}\n\nNous avons hâte de vous voir !`);
        
        // Reset form
        rdvForm.reset();
        updateSummary();
    });
    
    // Update summary when inputs change
    serviceSelect.addEventListener('change', updateSummary);
    dateInput.addEventListener('change', updateSummary);
    timeSelect.addEventListener('change', updateSummary);
    
    // Initialize summary
    updateSummary();
});

// Check for URL parameters when page loads
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    if (serviceParam) {
        const serviceSelect = document.getElementById('service');
        const optionToSelect = Array.from(serviceSelect.options).find(
            option => option.value === serviceParam
        );
        
        if (optionToSelect) {
            optionToSelect.selected = true;
            
            // Trigger the change event to update the summary
            const event = new Event('change');
            serviceSelect.dispatchEvent(event);
        }
    }
});


  document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour accéder à cette page.');
      window.location.href = 'login.html';
    }
  });
