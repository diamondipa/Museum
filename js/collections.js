// Collections page functionality
console.log("Collections page loaded");

// Function to show selected section and hide others
function showSection(sectionId) {
    console.log(`Showing section: ${sectionId}`);
    
    // Hide all collection sections
    const sections = document.querySelectorAll('.collection-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update button styles for visual feedback
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(sectionId)) {
            button.style.fontWeight = 'bold';
            button.style.color = '#fff';
        } else {
            button.style.fontWeight = 'normal';
            button.style.color = '';
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show archaeology section by default
    showSection('archaeology');
    
    // Add click handlers for navigation buttons
    const archButton = document.querySelector('button[onclick*="archaeology"]');
    const anthButton = document.querySelector('button[onclick*="anthropology"]');
    
    if (archButton && anthButton) {
        console.log("Navigation buttons found and initialized");
    }
});
