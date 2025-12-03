'use strict';

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
if (modalCloseBtn && overlay) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    if (select) {
      elementToggleFunc(select);
    }
    filterFunc(selectedValue);
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form && form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }

  });
}

/* ------------------------------
 * Dynamic rotating role title
 * ------------------------------ */

const roleTitle = document.getElementById("role-title");

if (roleTitle) {
  let roles = [];
  try {
    roles = JSON.parse(roleTitle.dataset.roles || "[]");
  } catch (e) {
    console.error("Unable to parse roles", e);
  }

  if (roles.length > 1) {
    let roleIndex = 0;

    const updateRole = () => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleTitle.classList.add("fade-out");

      setTimeout(() => {
        roleTitle.textContent = roles[roleIndex];
        roleTitle.classList.remove("fade-out");
        roleTitle.classList.add("fade-in");

        setTimeout(() => {
          roleTitle.classList.remove("fade-in");
        }, 400);
      }, 250);
    };

    setInterval(updateRole, 4000);
  }
}

/* ------------------------------
 * Reveal-on-scroll animations
 * ------------------------------ */

const revealElements = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: show everything
  revealElements.forEach(el => el.classList.add("is-visible"));
}

/* ------------------------------
 * Animated skill bars
 * ------------------------------ */

const skillBars = document.querySelectorAll(".skill-progress-fill");

if ("IntersectionObserver" in window) {
  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const value = bar.dataset.skillValue;
          if (value) {
            bar.style.width = value + "%";
          }
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillBars.forEach(bar => {
    bar.style.width = "0%";
    skillsObserver.observe(bar);
  });
} else {
  skillBars.forEach(bar => {
    const value = bar.dataset.skillValue;
    if (value) {
      bar.style.width = value + "%";
    }
  });
}
