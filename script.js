(() => {
      "use strict";

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const menuToggle = document.getElementById("menuToggle");
      const navLinks = document.getElementById("navLinks");
      const backTop = document.getElementById("backTop");
      const typedWord = document.getElementById("typedWord");
      const contactForm = document.getElementById("contactForm");
      const formStatus = document.getElementById("formStatus");
      const mailFallback = document.getElementById("mailFallback");

      document.getElementById("year").textContent = String(new Date().getFullYear());

      function closeMenu() {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.querySelector("use").setAttribute("href", "#i-menu");
      }

      menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        menuToggle.querySelector("use").setAttribute("href", isOpen ? "#i-menu" : "#i-close");
        navLinks.classList.toggle("open", !isOpen);
      });
      navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
      document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
      });
      document.addEventListener("click", event => {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
      });

      if (!reducedMotion) {
        const words = ["Full Stack Developer", "Digital Problem Solver", "Curious Creator"];
        let wordIndex = 0;
        let letterIndex = words[0].length;
        let deleting = true;
        const typeNext = () => {
          const current = words[wordIndex];
          letterIndex += deleting ? -1 : 1;
          typedWord.textContent = current.slice(0, letterIndex);
          let delay = deleting ? 48 : 78;
          if (letterIndex <= 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 380;
          } else if (letterIndex >= words[wordIndex].length) {
            deleting = true;
            delay = 1550;
          }
          window.setTimeout(typeNext, delay);
        };
        window.setTimeout(typeNext, 1800);
      }

      const revealItems = document.querySelectorAll(".reveal, .skill-card");
      if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: .12, rootMargin: "0px 0px -24px 0px" });
        revealItems.forEach(item => revealObserver.observe(item));
      } else {
        revealItems.forEach(item => item.classList.add("revealed"));
      }

      const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
      if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              sectionLinks.forEach(link => {
                if (link.getAttribute("href") === "#" + entry.target.id) {
                  link.setAttribute("aria-current", "location");
                } else {
                  link.removeAttribute("aria-current");
                }
              });
            }
          });
        }, { rootMargin: "-30% 0px -60% 0px" });
        document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
      }

      let scrollTicking = false;
      window.addEventListener("scroll", () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(() => {
          backTop.classList.toggle("visible", window.scrollY > 560);
          scrollTicking = false;
        });
      }, { passive: true });
      backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

      contactForm.addEventListener("submit", event => {
        event.preventDefault();
        formStatus.textContent = "";
        if (!contactForm.reportValidity()) return;

        const data = new FormData(contactForm);
        const name = String(data.get("name")).trim();
        const email = String(data.get("email")).trim();
        const subject = String(data.get("subject")).trim();
        const message = String(data.get("message")).trim();
        const body = `${message}\n\nFrom: ${name}\nEmail: ${email}`;
        const recipient = "parjapatuishant@gmail.com";
        const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        mailFallback.href = mailtoUrl;
        mailFallback.hidden = false;
        formStatus.textContent = "Opening a Gmail draft. Review it there and press Send.";
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
      });
    })();
