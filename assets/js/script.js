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
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.getElementById("form-status");

// detect localhost
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

function setFormStatus(message, type = "info") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = "form-status " + type;
}

// enable/disable button based on validity (optional, works if you add data-form-input)
const formInputs = document.querySelectorAll("[data-form-input]");
if (form && formBtn && formInputs.length) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}

if (form) {
  if (isLocal) {
    // ✅ LOCALHOST: fake a success, no real network request
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (formBtn) formBtn.setAttribute("disabled", "true");
      setFormStatus("Sending your message (local test only)...", "info");

      setTimeout(() => {
        setFormStatus(
          "Thanks for submitting! Your message will be emailed to Satyam.",
          "success"
        );
        form.reset();
        if (formBtn) formBtn.removeAttribute("disabled");
      }, 400); // shorter timeout
    });
  } else {
    // 🌐 LIVE SITE: let the browser POST normally to FormSubmit
    // If redirected back with ?sent=1, show success message.
    const params = new URLSearchParams(window.location.search);
    if (params.get("sent") === "1") {
      setFormStatus(
        "Thanks for submitting! Your message has been sent — I’ll get back to you soon.",
        "success"
      );
    }
  }
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


/* ------------------------------
 * Simple Satyam Chatbot
 * ------------------------------ */

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbot = document.getElementById("chatbot");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");

// your real resume link (direct download format)
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

/**
 * Very lightweight “AI-style” reply
 */
function getBotReply(message) {
  const m = message.toLowerCase().trim();

  // greetings
  if (/\b(hi|hey|hello|yo|hola|namaste)\b/.test(m)) {
    return (
      "Hey! 👋 I’m Satyam’s assistant.<br>" +
      "Ask me anything about my background, skills, projects, or resume."
    );
  }

  // small talk
  if (m.includes("how are you")) {
    return "I’m doing great and always ready to talk about Satyam. 😊 How can I help you?";
  }

  // thanks
  if (/\b(thanks|thank you|appreciate)\b/.test(m)) {
    return "You’re welcome! If you’d like to know more about my experience or projects, just ask. 🙌";
  }

  // resume
  if (m.includes("resume") || m.includes("cv") || m.includes("profile")) {
    return (
      "Sure — here’s my resume download link:<br>" +
      `<a href="${RESUME_LINK}" target="_blank" class="contact-link">Open Resume</a>`
    );
  }

  // who / about
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

  // experience / career
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

  // skills / stack
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

  // projects
  if (m.includes("project") || m.includes("projects")) {
    return (
      "Some highlights:<br>" +
      "• Affordability models and customer analytics for utilities at Exelon<br>" +
      "• Mail-Stream (mass emailer) & Path Finder AI (resume analyzer)<br>" +
      "• Pharma ML models with NSF CIMSEPP<br>" +
      "• Several dashboards and research pipelines across energy, finance, and cyberpsychology."
    );
  }

  // contact
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

  // default
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

// open / close handlers
chatbotToggle &&
  chatbotToggle.addEventListener("click", () => {
    toggleChat();
  });

chatbotClose &&
  chatbotClose.addEventListener("click", () => {
    toggleChat(false);
  });

// submit question
chatbotForm &&
  chatbotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chatbotInput || !chatbotInput.value.trim()) return;
    const text = chatbotInput.value.trim();
    chatbotInput.value = "";

    addChatMessage("user", text);
    const reply = getBotReply(text);
    setTimeout(() => addChatMessage("bot", reply), 250);
  });
