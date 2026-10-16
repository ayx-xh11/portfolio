import { initGravityGrid } from "./gravity-grid.js";

const header = document.querySelector("[data-site-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = [...document.querySelectorAll('[data-navigation] a[href^="#"]')];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateHeaderHeight() {
  if (!header) {
    return;
  }

  document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
}

function setMenuOpen(isOpen) {
  if (!menuButton || !navigation) {
    return;
  }

  menuButton.setAttribute("aria-expanded", String(isOpen));
  navigation.dataset.open = String(isOpen);
  menuButton.querySelector(".menu-button__label").textContent = isOpen ? "Close" : "Menu";
}

menuButton?.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
    menuButton?.focus();
  }
});

window.addEventListener("resize", () => {
  updateHeaderHeight();

  if (window.matchMedia("(min-width: 56.01rem)").matches) {
    setMenuOpen(false);
  }
});

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;

        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-28% 0px -58%",
      threshold: [0, 0.2, 0.5, 0.8],
    },
  );

  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

updateHeaderHeight();
initGravityGrid(document.querySelector("[data-gravity-field]"));
