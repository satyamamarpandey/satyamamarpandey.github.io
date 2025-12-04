"use strict";

(function () {
  const t = e => e.classList.toggle("active");

  // sidebar
  const s = document.querySelector("[data-sidebar]"),
    r = document.querySelector("[data-sidebar-btn]");
  if (s && r) {
    r.addEventListener("click", () => t(s));
  }

  // nav
  const n = document.querySelectorAll("[data-nav-link]"),
    p = document.querySelectorAll("[data-page]");
  if (n.length && p.length) {
    n.forEach(o => {
      o.addEventListener("click", () => {
        const c = o.textContent.trim().toLowerCase();
        n.forEach(i => i.classList.remove("active"));
        o.classList.add("active");
        p.forEach(i => {
          i.dataset.page === c
            ? i.classList.add("active")
            : i.classList.remove("active");
        });
      });
    });
  }

  // testimonials modal
  const m = document.querySelectorAll("[data-testimonials-item]"),
    d = document.querySelector("[data-modal-container]"),
    g = document.querySelector("[data-modal-close-btn]"),
    v = document.querySelector("[data-overlay]"),
    y = document.querySelector("[data-modal-img]"),
    w = document.querySelector("[data-modal-title]"),
    b = document.querySelector("[data-modal-text]");

  const M = () => {
    if (!d || !v) return;
    d.classList.toggle("active");
    v.classList.toggle("active");
  };

  for (let i = 0; i < m.length; i++) {
    m[i].addEventListener("click", function () {
      if (!y || !w || !b) return;
      const a = this.querySelector("[data-testimonials-avatar]");
      const l = this.querySelector("[data-testimonials-title]");
      const h = this.querySelector("[data-testimonials-text]");
      y.src = a ? a.src : "";
      y.alt = a ? a.alt : "";
      w.innerHTML = l ? l.innerHTML : "";
      b.innerHTML = h ? h.innerHTML : "";
      M();
    });
  }

  if (g && v) {
    g.addEventListener("click", M);
    v.addEventListener("click", M);
  }

  // portfolio filters
  const S = document.querySelector("[data-select]"),
    q = document.querySelectorAll("[data-select-item]"),
    k = document.querySelector("[data-selecct-value]"),
    x = document.querySelectorAll("[data-filter-btn]"),
    C = document.querySelectorAll("[data-filter-item]");

  S && S.addEventListener("click", function () {
    t(this);
  });

  const F = a => {
    C.forEach(e => {
      a === "all" || a === e.dataset.category
        ? e.classList.add("active")
        : e.classList.remove("active");
    });
  };

  q.forEach(e => {
    e.addEventListener("click", function () {
      const a = this.innerText.toLowerCase();
      k && (k.innerText = this.innerText);
      S && t(S);
      F(a);
    });
  });

  if (x.length) {
    let a = x[0];
    x.forEach(e => {
      e.addEventListener("click", function () {
        const l = this.innerText.toLowerCase();
        k && (k.innerText = this.innerText);
        F(l);
        a.classList.remove("active");
        this.classList.add("active");
        a = this;
      });
    });
  }

  // contact form + web3forms
  const f = document.querySelector("[data-form]"),
    I = document.querySelectorAll("[data-form-input]"),
    B = document.querySelector("[data-form-btn]"),
    L = document.querySelector("[data-form-status]");

  if (f && I && B) {
    B.setAttribute("disabled", "");
    I.forEach(e => {
      e.addEventListener("input", () => {
        f.checkValidity()
          ? B.removeAttribute("disabled")
          : B.setAttribute("disabled", "");
      });
    });
  }

  const A = () => {
    if (!L) return;
    setTimeout(() => {
      L.textContent = "";
      L.classList.remove("success", "error");
    }, 3000); // 3 seconds
  };

  f &&
    f.addEventListener("submit", async e => {
      e.preventDefault();
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }

      if (B) {
        B.setAttribute("disabled", "");
        B.classList.add("is-loading");
        const a = B.querySelector("span");
        a && (a.textContent = "Sending...");
      }

      if (L) {
        L.textContent = "Sending your message...";
        L.classList.remove("success", "error");
      }

      const a = new FormData(f);

      try {
        const l = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: a
        });
        const h = await l.json();

        if (h.success) {
          if (L) {
            L.textContent =
              "Thanks for reaching out! I’ll get back to you soon.";
            L.classList.add("success");
          }
          f.reset();
          A(); // hide after 3s
        } else {
          console.error(h);
          if (L) {
            L.textContent =
              "Something went wrong. Please email me directly at 7satyampandey@gmail.com.";
            L.classList.add("error");
          }
          A();
        }
      } catch (err) {
        console.error(err);
        if (L) {
          L.textContent =
            "Unable to send right now. Please email me directly at 7satyampandey@gmail.com.";
          L.classList.add("error");
        }
        A();
      } finally {
        if (B) {
          B.removeAttribute("disabled");
          B.classList.remove("is-loading");
          const a = B.querySelector("span");
          a && (a.textContent = "Send Message");
        }
      }
    });

  // rotating role title
  const T = document.getElementById("role-title");
  if (T) {
    let a = [];
    try {
      a = JSON.parse(T.dataset.roles || "[]");
    } catch (e) {
      console.error("Unable to parse roles", e);
    }
    if (a.length > 1) {
      let i = 0;
      const l = () => {
        i = (i + 1) % a.length;
        T.classList.add("fade-out");
        setTimeout(() => {
          T.textContent = a[i];
          T.classList.remove("fade-out");
          T.classList.add("fade-in");
          setTimeout(() => {
            T.classList.remove("fade-in");
          }, 400);
        }, 250);
      };
      setInterval(l, 4000);
    }
  }

  // reveal-on-scroll
  const O = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window) {
    const a = new IntersectionObserver(
      (e, o) => {
        e.forEach(i => {
          if (i.isIntersecting) {
            i.target.classList.add("is-visible");
            o.unobserve(i.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    O.forEach(e => a.observe(e));
  } else {
    O.forEach(e => e.classList.add("is-visible"));
  }

  // skill bars
  const P = document.querySelectorAll(".skill-progress-fill");
  if ("IntersectionObserver" in window) {
    const a = new IntersectionObserver(
      (e, o) => {
        e.forEach(i => {
          if (i.isIntersecting) {
            const l = i.target,
              h = l.dataset.skillValue;
            h && (l.style.width = h + "%");
            o.unobserve(l);
          }
        });
      },
      { threshold: 0.4 }
    );
    P.forEach(e => {
      e.style.width = "0%";
      a.observe(e);
    });
  } else {
    P.forEach(e => {
      const a = e.dataset.skillValue;
      a && (e.style.width = a + "%");
    });
  }

  // simple chatbot
  const E = document.getElementById("chatbot-toggle"),
    D = document.getElementById("chatbot"),
    R = document.getElementById("chatbot-close"),
    N = document.getElementById("chatbot-form"),
    H = document.getElementById("chatbot-input"),
    U = document.getElementById("chatbot-messages"),
    J =
      "https://drive.google.com/uc?export=download&id=1rvuMASPPef4KxV474H-LwMIt7C9_rHMj";

  function z(e) {
    if (!D) return;
    const a = D.classList.contains("open");
    if (e === true || (!a && e !== false)) D.classList.add("open");
    else D.classList.remove("open");
  }

  function G(e, a) {
    if (!U) return;
    const l = document.createElement("div");
    l.className = "chatbot-message-row";
    const h = document.createElement("div");
    h.className = "chatbot-message " + (e === "user" ? "user" : "bot");
    h.innerHTML = a;
    l.appendChild(h);
    U.appendChild(l);
    U.scrollTop = U.scrollHeight;
  }

  function K(msg) {
    const m = msg.toLowerCase().trim();

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
        `<a href="${J}" target="_blank" class="contact-link">Open Resume</a>`
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

  E && E.addEventListener("click", () => z());
  R && R.addEventListener("click", () => z(false));

  N &&
    N.addEventListener("submit", e => {
      e.preventDefault();
      if (!H || !H.value.trim()) return;
      const a = H.value.trim();
      H.value = "";
      G("user", a);
      const l = K(a);
      setTimeout(() => G("bot", l), 250);
    });
})();
