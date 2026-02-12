// Modal System
(function(){
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    let lastTrigger = null;

    function openFrom(selector, trigger){
        const src = document.querySelector(selector);
        if (!src) { 
            console.warn('Missing modal content:', selector); 
            return; 
        }
        modalBody.innerHTML = src.innerHTML;
        modal.style.display = 'block';
        lastTrigger = trigger || null;
        if (closeBtn) closeBtn.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal(){
        modal.style.display = 'none';
        modalBody.innerHTML = '';
        document.body.style.overflow = '';
        if (lastTrigger) lastTrigger.focus();
    }

    // Open modal on click
    document.addEventListener('click', (e)=>{
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger){
            e.preventDefault();
            openFrom(trigger.getAttribute('data-modal-target'), trigger);
            return;
        }
        if (e.target === modal || e.target.closest('.close-modal')) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e)=>{
        if (e.key === 'Escape' && modal && modal.style.display === 'block') closeModal();
    });
})();

// Section Toggle Function (Archaeology, Anthropology, Histories)
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.collection-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update button styles
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(sectionId)) {
            button.style.backgroundColor = '#555';
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    });
}

// Initialize: Show archaeology section by default
document.addEventListener('DOMContentLoaded', function() {
    showSection('archaeology');
});
