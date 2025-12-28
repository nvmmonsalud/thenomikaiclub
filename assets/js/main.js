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

  const planner = document.querySelector('.planner');
  if (planner) {
    const focusGroups = planner.querySelectorAll('[data-planner-group="focus"]');
    const timeSelect = planner.querySelector('[data-planner-time]');
    const paceSelect = planner.querySelector('[data-planner-pace]');
    const groupSelect = planner.querySelector('[data-planner-group-size]');
    const titleEl = planner.querySelector('[data-planner-title]');
    const stepsEl = planner.querySelector('[data-planner-steps]');
    const noteEl = planner.querySelector('[data-planner-note]');

    const focusPlans = {
      whisky: {
        title: 'Ginza whisky salons + Ebisu nightcap',
        steps: [
          'Start with a tasting flight in Ginza.',
          'Move to Shinjuku for a small-batch pour.',
          'Close with a rare single malt in Ebisu.'
        ]
      },
      balanced: {
        title: 'Ginza whisky salons + vinyl detour',
        steps: [
          'Start with a highball flight in Ginza.',
          'Shift to Shibuya for a listening bar session.',
          'Finish in Ebisu with a rare single malt.'
        ]
      },
      vinyl: {
        title: 'Shibuya listening bars + Shimokitazawa vinyl',
        steps: [
          'Warm up with cocktails and a DJ set in Shibuya.',
          'Browse vinyl-first bars in Shimokitazawa.',
          'End with a soul jazz set and a digestif.'
        ]
      }
    };

    const paceNotes = {
      slow: 'Slow pace · linger 90 minutes per stop.',
      steady: 'Steady crawl · aim for 60 minutes per stop.',
      sprint: 'Late-night sprint · keep stops to 45 minutes.'
    };

    const groupNotes = {
      solo: 'Great for 4-6 seat counters.',
      small: 'Book a four-seat counter in advance.',
      large: 'Split into two groups for easier seating.'
    };

    const updatePlanner = () => {
      const activeButton = planner.querySelector('[data-planner-group="focus"] .option-button.is-active');
      const focus = activeButton?.dataset.value || 'balanced';
      const plan = focusPlans[focus] || focusPlans.balanced;
      const timeLabel = timeSelect?.selectedOptions[0]?.textContent ?? '';
      const paceLabel = paceNotes[paceSelect?.value] ?? '';
      const groupLabel = groupNotes[groupSelect?.value] ?? '';

      if (titleEl) {
        titleEl.textContent = plan.title;
      }

      if (stepsEl) {
        stepsEl.innerHTML = '';
        plan.steps.forEach(step => {
          const li = document.createElement('li');
          li.textContent = step;
          stepsEl.appendChild(li);
        });
      }

      if (noteEl) {
        noteEl.textContent = `${timeLabel} start · ${paceLabel} ${groupLabel}`;
      }
    };

    focusGroups.forEach(group => {
      group.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => {
          group.querySelectorAll('.option-button').forEach(item => item.classList.remove('is-active'));
          button.classList.add('is-active');
          updatePlanner();
        });
      });
    });

    [timeSelect, paceSelect, groupSelect].forEach(select => {
      if (select) {
        select.addEventListener('change', updatePlanner);
      }
    });

    updatePlanner();
  }
});
