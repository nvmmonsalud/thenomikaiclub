async function loadPartials() {
  const includeTargets = Array.from(document.querySelectorAll('[data-include]'));
  const loads = includeTargets.map(async (el) => {
    const src = el.getAttribute('data-include');
    if (!src) return;

    try {
      const response = await fetch(src);
      if (!response.ok) {
        console.error(`Failed to load partial: ${src}`);
        return;
      }
      const html = await response.text();
      el.innerHTML = html;
    } catch (error) {
      console.error(`Error loading partial ${src}:`, error);
    }
  });

  await Promise.all(loads);
}

function setupNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');

  if (!header || !toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPartials();
  setupNavigation();
});
