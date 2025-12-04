"use strict";

/* ---------------------------------------
 * Small helper: toggle .active
 * --------------------------------------- */

const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/* ---------------------------------------
 * SIDEBAR (mobile show contacts)
 * --------------------------------------- */

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

/* ---------------------------------------
 * NAVBAR: page switching (About / Resume / ...)
 * --------------------------------------- */

const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

if (navLinks.length && pages.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.textContent.trim().toLowerCase(); // "about", "resume", ...

      // update nav active state
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // show matching page
      pages.forEach((page) => {
        if (page.dataset.page === target) {
          page.classList.add("active");
        } else {
          page.classList.remove("active");
        }
      });
    });
  });
}

/* ---------------------------------------
 * TESTIMONIALS MODAL
 * --------------------------------------- */

const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  if (!modalContainer || !overlay) return;
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    if (!modalImg || !modalTitle || !modalText) return;

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML =
      this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML =
      this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();
  });
}

if (modalCloseBtn && overlay) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}

/* ---------------------------------------
 * PORTFOLIO FILTERS
 * --------------------------------------- */

// custom select (mobile)
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");

// filter buttons (desktop)
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

const filterFunc = function (selectedValue) {
  filterItems.forEach((item) => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

// select dropdown (mobile)
selectItems.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// filter buttons (desktop)
if (filterBtn.length) {
  let lastClickedBtn = filterBtn[0];
  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
}

/* ---------------------------------------
 * CONTACT FORM: validation + AJAX submit
 * --------------------------------------- */

const form = document.querySelector("[data-form]");
const formInputs = form ? form.querySelectorAll("[data-form-input]") : [];
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.getElementById("form-status");

function setFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message || "";
  formStatus.classList.remove("success", "error");
  if (type) formStatus.classList.add(type);
}

if (form) {
  // button disabled initially
  if (formBtn) formBtn.setAttribute("disabled", "");

  // enable/disable based on validity
  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!formBtn) return;
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!formBtn) return;

    const btnSpan = formBtn.querySelector("span");
    const originalBtnText = btnSpan ? btnSpan.textContent : "Send Message";

    formBtn.setAttribute("disabled", "");
    if (btnSpan) btnSpan.textContent = "Sending...";
    setFormStatus("Sending your message...", null);

    const isLocal =
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1";

    const formData = new FormData(form);

    // Localhost: fake success for testing
    if (isLocal) {
      setTimeout(() => {
        setFormStatus(
          "Thanks for submitting! Your message has been recorded (local test).",
          "success"
        );
        form.reset();
        formBtn.removeAttribute("disabled");
        if (btnSpan) btnSpan.textContent = originalBtnText;
        setTimeout(() => setFormStatus("", null), 2500);
      }, 300);
      return;
    }

    // Live: real POST to FormSubmit
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setFormStatus(
          "Thanks for submitting! Your message has been sent — I’ll get back to you soon.",
          "success"
        );
        form.reset();
      } else {
        setFormStatus(
          "Something went wrong while sending your message. Please try again or email me directly.",
          "error"
        );
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setFormStatus(
        "Network error. Please try again or email me directly.",
        "error"
      );
    } finally {
      formBtn.removeAttribute("disabled");
      if (btnSpan) btnSpan.textContent = originalBtnText;
      setTimeout(() => setFormStatus("", null), 3000);
    }
  });
}

/* ---------------------------------------
 * Dynamic rotating role title
 * --------------------------------------- */

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

/* ---------------------------------------
 * Reveal-on-scroll animations
 * --------------------------------------- */

const revealElements = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

/* ---------------------------------------
 * Animated skill bars
 * --------------------------------------- */

const skillBars = document.querySelectorAll(".skill-progress-fill");

if ("IntersectionObserver" in window) {
  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const value = bar.dataset.skillValue;
          if (value) bar.style.width = value + "%";
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillBars.forEach((bar) => {
    bar.style.width = "0%";
    skillsObserver.observe(bar);
  });
} else {
  skillBars.forEach((bar) => {
    const value = bar.dataset.skillValue;
    if (value) bar.style.width = value + "%";
  });
}

/* ---------------------------------------
 * Simple Satyam Chatbot
 * --------------------------------------- */

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbot = document.getElementById("chatbot");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");

const RESUME_LINK =
  "https://drive.google.com/uc?export=download&id=1rvuMASPPef4KxV474H-LwMIt7C9_rHMj";

function toggleChat(open) {
  if (!chatbot) return;
  const isOpen = chatbot.classList.contains("open");
  if (open === true || (!isOpen && open !== false)) {
    chatbot.classList.add("open");
  } else {
    chatbot.classList.remove("open");
  }
}

function addChatMessage(sender, text) {
  if (!chatbotMessages) return;
  const wrapper = document.createElement("div");
  wrapper.className = "chatbot-message-row";

  const msg = document.createElement("div");
  msg.className = "chatbot-message " + (sender === "user" ? "user" : "bot");
  msg.innerHTML = text;

  wrapper.appendChild(msg);
  chatbotMessages.appendChild(wrapper);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getBotReply(message) {
  const m = message.toLowerCase().trim();

  if (/\b(hi|hey|hello|yo|hola|namaste)\b/.test(m)) {
    return (
      "Hey! 👋 I’m Satyam’s assistant.<br>" +
      "Ask me anything about my background, skills, projects, or resume."
    );
  }

  if (m.includes("how are you")) {
    return "I’m doing great and always ready to talk about Satyam. 😊 How can I help you?";
  }

  if (/\b(thanks|thank you|appreciate)\b/.test(m)) {
    return "You’re welcome! If you’d like to know more about my experience or projects, just ask. 🙌";
  }

  if (m.includes("resume") || m.includes("cv") || m.includes("profile")) {
    return (
      "Sure — here’s my resume download link:<br>" +
      `<a href="${RESUME_LINK}" target="_blank" class="contact-link">Open Resume</a>`
    );
  }

  if (
    m.includes("who are you") ||
    m.includes("about yourself") ||
    m.includes("about you") ||
    m.includes("background") ||
    m.includes("tell me about you")
  ) {
    return (
      "I’m Satyam Pandey, a Senior Quantitative Analyst and data scientist. " +
      "I work on quantitative modeling, data engineering, and ML solutions across " +
      "energy, finance, and research."
    );
  }

  if (
    m.includes("experience") ||
    m.includes("work history") ||
    m.includes("career") ||
    m.includes("where have you worked")
  ) {
    return (
      "I’ve worked with Exelon (energy & utilities), PECO, the National Science Foundation " +
      "(CIMSEPP pharma research), and ZS Associates — focusing on data science, " +
      "quantitative modeling, and cloud analytics."
    );
  }

  if (
    m.includes("skills") ||
    m.includes("tech stack") ||
    m.includes("tools") ||
    m.includes("what do you use")
  ) {
    return (
      "Core skills: Python, R, SQL, statistics, ML, NLP, time series, data engineering, " +
      "Tableau / Power BI, and cloud platforms like AWS, Azure, and GCP."
    );
  }

  if (m.includes("project") || m.includes("projects")) {
    return (
      "Some highlights:<br>" +
      "• Affordability models and customer analytics for utilities at Exelon<br>" +
      "• Mail-Stream (mass emailer) & Path Finder AI (resume analyzer)<br>" +
      "• Pharma ML models with NSF CIMSEPP<br>" +
      "• Several dashboards and research pipelines across energy, finance, and cyberpsychology."
    );
  }

  if (
    m.includes("contact") ||
    m.includes("reach") ||
    m.includes("email") ||
    m.includes("connect")
  ) {
    return (
      'You can reach me at ' +
      '<a href="mailto:7satyampandey@gmail.com" class="contact-link">7satyampandey@gmail.com</a> ' +
      "or via LinkedIn: " +
      '<a href="https://www.linkedin.com/in/pandeysatyam" target="_blank" class="contact-link">LinkedIn Profile</a>.'
    );
  }

  return (
    "Nice question! I’m a simple on-page bot, so I’m best at talking about Satyam — " +
    "his background, skills, projects, and resume.<br><br>" +
    "You can try asking things like:<br>" +
    "• “What experience do you have?”<br>" +
    "• “What skills do you know?”<br>" +
    "• “What projects have you done?”<br>" +
    "• “Share your resume.”"
  );
}

if (chatbotToggle) {
  chatbotToggle.addEventListener("click", () => toggleChat());
}

if (chatbotClose) {
  chatbotClose.addEventListener("click", () => toggleChat(false));
}

if (chatbotForm) {
  chatbotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chatbotInput || !chatbotInput.value.trim()) return;
    const text = chatbotInput.value.trim();
    chatbotInput.value = "";

    addChatMessage("user", text);
    const reply = getBotReply(text);
    setTimeout(() => addChatMessage("bot", reply), 250);
  });
}
