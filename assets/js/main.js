document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const siteHeader = document.querySelector('.site-header');

  links.forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (menuToggle && navLinks) {
    const syncMenuState = () => {
      const isDesktop = !window.matchMedia('(max-width: 900px)').matches;
      if (isDesktop) {
        navLinks.classList.remove('open');
        navLinks.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else if (!navLinks.classList.contains('open')) {
        navLinks.setAttribute('aria-hidden', 'true');
      }
    };

    const setMenuState = isOpen => {
      navLinks.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      navLinks.setAttribute('aria-hidden', String(!isOpen));
    };

    const closeMenu = () => setMenuState(false);

    menuToggle.addEventListener('click', () => {
      const isOpen = !navLinks.classList.contains('open');
      setMenuState(isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 900px)').matches) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', syncMenuState);

    syncMenuState();

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  if (siteHeader) {
    const updateStickyState = () => {
      const isSticky = window.scrollY > 12;
      siteHeader.classList.toggle('is-sticky', isSticky);
    };

    updateStickyState();
    window.addEventListener('scroll', updateStickyState, { passive: true });
  }
});
