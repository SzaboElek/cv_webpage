const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".topbar nav a");
const sections = document.querySelectorAll("main section[id]");
const progressBar = document.getElementById("scroll-progress");
const heroStage = document.getElementById("hero-stage");
const parallaxItems = heroStage ? heroStage.querySelectorAll("[data-parallax]") : [];

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

  progressBar.style.width = `${Math.min(progress, 100)}%`;
};

const updateActiveNav = () => {
  const current = Array.from(sections).find((section) => {
    const top = section.offsetTop - 160;
    const bottom = top + section.offsetHeight;
    return window.scrollY >= top && window.scrollY < bottom;
  });

  navLinks.forEach((link) => {
    const isActive = current && link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("is-active", Boolean(isActive));
  });
};

const onScroll = () => {
  updateScrollProgress();
  updateActiveNav();
};

if (heroStage && !prefersReducedMotion) {
  const resetParallax = () => {
    parallaxItems.forEach((item) => {
      item.style.transform = "translate3d(0, 0, 0)";
    });
  };

  heroStage.addEventListener("pointermove", (event) => {
    const bounds = heroStage.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;

    parallaxItems.forEach((item) => {
      const amount = Number(item.dataset.parallax || 0);
      const moveX = (offsetX / bounds.width) * amount;
      const moveY = (offsetY / bounds.height) * amount;

      item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  heroStage.addEventListener("pointerleave", resetParallax);
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
window.addEventListener("load", onScroll);

onScroll();
