document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const filterBlocks = document.querySelectorAll('[data-filter-target]');

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
    const closeMenu = () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 900px)').matches) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 900px)').matches) {
        closeMenu();
      }
    });
  }

  filterBlocks.forEach(block => {
    const targetSelector = block.getAttribute('data-filter-target');
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    if (!target) {
      return;
    }

    const selects = block.querySelectorAll('select[data-filter]');
    const resetButton = block.querySelector('[data-filter-reset]');
    const cards = target.querySelectorAll('.card');

    const applyFilters = () => {
      const activeFilters = Array.from(selects).reduce((filters, select) => {
        const filterValue = select.value;
        if (filterValue && filterValue !== 'all') {
          filters[select.dataset.filter] = filterValue;
        }
        return filters;
      }, {});

      cards.forEach(card => {
        const matches = Object.entries(activeFilters).every(([key, value]) => {
          const cardValue = card.dataset[key];
          if (!cardValue) {
            return false;
          }
          return cardValue.split(',').map(item => item.trim()).includes(value);
        });

        card.hidden = !matches && Object.keys(activeFilters).length > 0;
      });
    };

    selects.forEach(select => {
      select.addEventListener('change', applyFilters);
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        selects.forEach(select => {
          select.value = 'all';
        });
        applyFilters();
      });
    }
  });
});
