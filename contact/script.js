// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast(`Thank you ${name}! Your message has been sent to our florists.`);
      form.reset();
    });
  }
});
