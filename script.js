// Planner logic + micro-interactions
const plannerConfig = {
  whisky: {
    title: "Ginza whisky salons + vinyl detour",
    steps: [
      "Start with a highball flight in Ginza.",
      "Shift to Shibuya for a listening bar session.",
      "Finish in Ebisu with a rare single malt."
    ],
    tip: "Reserve a quiet counter seat for focused pours."
  },
  balanced: {
    title: "Shinjuku vinyl rooms + whisky interlude",
    steps: [
      "Warm up in Shinjuku with a vinyl-first listening bar.",
      "Head to Ginza for a tasting set and signature highball.",
      "Land in Ebisu for a late-night jazz lounge."
    ],
    tip: "Split the night between one booking and two walk-ins."
  },
  vinyl: {
    title: "Shibuya needle drops + whisky nightcap",
    steps: [
      "Start with a curated set in Shibuya.",
      "Drift to Shimokitazawa for crate digging and cocktails.",
      "Close in Ginza with a mellow single malt."
    ],
    tip: "Ask for a listening seat to catch the full soundstage."
  }
};

const plannerTitle = document.querySelector("[data-planner-title]");
const plannerSteps = document.querySelector("[data-planner-steps]");
const plannerNote = document.querySelector("[data-planner-note]");

const formatSelections = (start, pace, group) => {
  const startLabel = {
    early: "18:30 start",
    classic: "19:30 start",
    late: "20:30 start"
  }[start];

  const paceLabel = {
    slow: "Slow & savoring",
    steady: "Steady crawl",
    sprint: "Late-night sprint"
  }[pace];

  const groupLabel = {
    solo: "Best for 1–2 seats",
    small: "Best for 3–4 seats",
    large: "Reserve a private booth"
  }[group];

  return `${startLabel} · ${paceLabel} · ${groupLabel}`;
};

const updatePlanner = () => {
  const focus = document.querySelector('input[name="focus"]:checked')?.value || "whisky";
  const start = document.querySelector('input[name="start"]:checked')?.value || "classic";
  const pace = document.querySelector('input[name="pace"]:checked')?.value || "steady";
  const group = document.querySelector('input[name="group"]:checked')?.value || "small";

  const config = plannerConfig[focus];
  plannerTitle.textContent = config.title;
  plannerSteps.innerHTML = config.steps.map(step => `<li>${step}</li>`).join("");
  plannerNote.textContent = `${formatSelections(start, pace, group)} · ${config.tip}`;
};

const plannerForm = document.querySelector(".planner-form");
if (plannerForm) {
  plannerForm.addEventListener("change", updatePlanner);
}

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Reveal on scroll
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("is-visible"));
}

// ScrollSpy-lite for in-page sections
const sections = document.querySelectorAll("[data-section]");
const navLinks = document.querySelectorAll("[data-nav]");
if ("IntersectionObserver" in window && sections.length) {
  const spyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.section;
          navLinks.forEach(link => {
            link.classList.toggle("is-active", link.dataset.nav === id);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach(section => spyObserver.observe(section));
}

updatePlanner();
