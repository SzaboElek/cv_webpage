const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".topbar nav a");
const sections = document.querySelectorAll("main section[id]");
const progressBar = document.getElementById("scroll-progress");
const heroStage = document.getElementById("hero-stage");
const parallaxItems = heroStage ? heroStage.querySelectorAll("[data-parallax]") : [];
const fortuneButton = document.getElementById("fortune-button");
const fortuneCard = document.querySelector(".fortune-card");
const fortuneText = document.getElementById("fortune-text");
const fortuneMeta = document.getElementById("fortune-meta");
const fortuneBadge = document.getElementById("fortune-badge");

const fortunes = [
  {
    badge: "Mai löket",
    text: "A jó rendszer akkor a legerősebb, amikor csendben, stabilan végzi a dolgát.",
    meta: "A láthatatlan minőség sokszor többet ér, mint a látványos improvizáció.",
  },
  {
    badge: "IT mantra",
    text: "A jó hibakeresés nem kapkodás, hanem jó kérdések sorozata.",
    meta: "A legtöbb probléma gyorsabban oldódik meg, ha előbb pontosan definiálod.",
  },
  {
    badge: "Mai fokusz",
    text: "A fejlődés legtöbbször ott kezdődik, ahol a kényelem véget ér.",
    meta: "Az új szinthez nem szerencse kell, hanem következetes tempó.",
  },
  {
    badge: "Rendszeruzem",
    text: "A felelősség nem teher, ha pontosan látod a teljes rendszert.",
    meta: "Az átlátás sokszor nagyobb érték, mint egyetlen különleges technológia.",
  },
  {
    badge: "Szerencsesuti",
    text: "A jó infrastruktúra olyan, mint a jó alap: nem dicsekszik, de mindent megtart.",
    meta: "A stabilitás mögött mindig fegyelem, rutin és jó döntések vannak.",
  },
  {
    badge: "Mai mondat",
    text: "Nem az a cél, hogy mindig gyors legyél, hanem hogy újra és újra megbízható legyél.",
    meta: "A szakmai hitelesség naponta épül, apró döntésekből.",
  },
];

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

if (fortuneButton && fortuneCard && fortuneText && fortuneMeta && fortuneBadge) {
  const dailySeed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  let currentFortune = dailySeed % fortunes.length;

  const renderFortune = (index, animate = true) => {
    const next = fortunes[index];

    if (!animate || prefersReducedMotion) {
      fortuneBadge.textContent = next.badge;
      fortuneText.textContent = next.text;
      fortuneMeta.textContent = next.meta;
      return;
    }

    fortuneCard.classList.add("is-swapping");

    window.setTimeout(() => {
      fortuneBadge.textContent = next.badge;
      fortuneText.textContent = next.text;
      fortuneMeta.textContent = next.meta;
      fortuneCard.classList.remove("is-swapping");
    }, 180);
  };

  renderFortune(currentFortune, false);

  fortuneButton.addEventListener("click", () => {
    let nextIndex = Math.floor(Math.random() * fortunes.length);

    if (fortunes.length > 1) {
      while (nextIndex === currentFortune) {
        nextIndex = Math.floor(Math.random() * fortunes.length);
      }
    }

    currentFortune = nextIndex;
    renderFortune(currentFortune);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
window.addEventListener("load", onScroll);

onScroll();
