/* =====================================================
   MODEL TOWN WHITES CAGE CRICKET CLUB — SCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------------
     PRELOADER
  ----------------------------------------------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", function () {
    setTimeout(function () {
      preloader.classList.add("loaded");
    }, 400);
  });
  // Fallback in case load event already fired
  setTimeout(function () {
    preloader.classList.add("loaded");
  }, 2500);

  /* -----------------------------------------------
     CUSTOM CURSOR
  ----------------------------------------------- */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveEls = document.querySelectorAll("a, button, input, select, textarea, .magnetic");
    interactiveEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursorRing.classList.add("cursor-active");
      });
      el.addEventListener("mouseleave", function () {
        cursorRing.classList.remove("cursor-active");
      });
    });
  } else {
    cursorDot.style.display = "none";
    cursorRing.style.display = "none";
  }

  /* -----------------------------------------------
     SCROLL PROGRESS BAR
  ----------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  }

  /* -----------------------------------------------
     NAVBAR SCROLL STATE
  ----------------------------------------------- */
  const navbar = document.getElementById("navbar");
  function updateNavbarState() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  /* -----------------------------------------------
     BACK TO TOP BUTTON
  ----------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  function updateBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }
  backToTop.addEventListener("click", function () {
    smoothScrollTo(0);
  });

  /* -----------------------------------------------
     COMBINED SCROLL LISTENER (throttled via rAF)
  ----------------------------------------------- */
  let scrollTicking = false;
  window.addEventListener("scroll", function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavbarState();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
  updateScrollProgress();
  updateNavbarState();
  updateBackToTop();

  /* -----------------------------------------------
     CUSTOM SMOOTH SCROLL
  ----------------------------------------------- */
  function smoothScrollTo(targetY, duration) {
    duration = duration || 900;
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const scrollLinks = document.querySelectorAll('[data-scroll]');
  scrollLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const navHeight = navbar.offsetHeight;
          const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navHeight + 1;
          smoothScrollTo(Math.max(targetY, 0));
          closeMobileMenu();
        }
      }
    });
  });

  /* -----------------------------------------------
     MOBILE MENU
  ----------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  function openMobileMenu() {
    hamburger.classList.add("active");
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", function () {
    if (mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  overlay.addEventListener("click", closeMobileMenu);

  /* -----------------------------------------------
     INTERSECTION OBSERVER — REVEAL ANIMATIONS
  ----------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  });
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* -----------------------------------------------
     HERO TITLE LINE REVEAL (separate, immediate)
  ----------------------------------------------- */
  const lineInners = document.querySelectorAll(".reveal-line-inner");
  const lineObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  lineInners.forEach(function (el) {
    lineObserver.observe(el);
  });

  /* -----------------------------------------------
     ANIMATED COUNTER (Hero Stats)
  ----------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    let startTime = null;

    function step(currentTime) {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------
     MAGNETIC BUTTON EFFECT
  ----------------------------------------------- */
  const magneticButtons = document.querySelectorAll(".magnetic");
  magneticButtons.forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      const strength = 0.35;
      btn.style.transform = "translate(" + (relX * strength) + "px, " + (relY * strength) + "px)";

      const icon = btn.querySelector("i");
      if (icon) {
        icon.style.transform = "translate(" + (relX * 0.2) + "px, " + (relY * 0.2) + "px)";
      }
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "translate(0, 0)";
      const icon = btn.querySelector("i");
      if (icon) {
        icon.style.transform = "translate(0, 0)";
      }
    });
  });

  /* -----------------------------------------------
     PARTICLE CANVAS BACKGROUND (Hero)
  ----------------------------------------------- */
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const heroSection = document.querySelector(".hero");
  let particles = [];
  let canvasWidth, canvasHeight;
  let mouseParticleX = null, mouseParticleY = null;

  function resizeCanvas() {
    canvasWidth = heroSection.offsetWidth;
    canvasHeight = heroSection.offsetHeight;
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvasWidth * canvasHeight) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.15
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvasWidth;
      if (p.x > canvasWidth) p.x = 0;
      if (p.y < 0) p.y = canvasHeight;
      if (p.y > canvasHeight) p.y = 0;

      if (mouseParticleX !== null) {
        const dx = mouseParticleX - p.x;
        const dy = mouseParticleY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.x -= (dx / dist) * force * 1.2;
          p.y -= (dy / dist) * force * 1.2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(57, 255, 20, " + p.opacity + ")";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = "rgba(57, 255, 20, " + (0.12 * (1 - dist2 / 110)) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  heroSection.addEventListener("mousemove", function (e) {
    const rect = heroSection.getBoundingClientRect();
    mouseParticleX = e.clientX - rect.left;
    mouseParticleY = e.clientY - rect.top;
  });

  heroSection.addEventListener("mouseleave", function () {
    mouseParticleX = null;
    mouseParticleY = null;
  });

  resizeCanvas();
  createParticles();
  drawParticles();

  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      resizeCanvas();
      createParticles();
    }, 250);
  });

  /* -----------------------------------------------
     LIVE STATUS DASHBOARD (Timings Section)
  ----------------------------------------------- */
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const statusClock = document.getElementById("statusClock");
  const weekDays = document.querySelectorAll(".week-day");

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  function updateClubStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday ... 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const totalMinutes = hours * 60 + minutes;

    let isOpen = false;
    let closesAt = "";

    const isWeekend = (day === 0 || day === 6);

    if (isWeekend) {
      // 10:00 AM - 11:00 PM
      const openMin = 10 * 60;
      const closeMin = 23 * 60;
      isOpen = totalMinutes >= openMin && totalMinutes < closeMin;
      closesAt = "11:00 PM";
    } else {
      // 5:00 AM - 12:00 AM (midnight)
      const openMin = 5 * 60;
      const closeMin = 24 * 60;
      isOpen = totalMinutes >= openMin && totalMinutes < closeMin;
      closesAt = "12:00 AM";
    }

    if (isOpen) {
      statusDot.classList.add("open");
      statusDot.classList.remove("closed");
      statusText.textContent = "We're Open Now — Closes at " + closesAt;
    } else {
      statusDot.classList.add("closed");
      statusDot.classList.remove("open");
      statusText.textContent = "Currently Closed — Opens Soon";
    }

    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    statusClock.textContent = pad(displayHours) + ":" + pad(minutes) + ":" + pad(seconds) + " " + ampm;

    weekDays.forEach(function (dayEl) {
      const dayIndex = parseInt(dayEl.getAttribute("data-day"), 10);
      if (dayIndex === day) {
        dayEl.classList.add("is-today");
      } else {
        dayEl.classList.remove("is-today");
      }
    });
  }

  updateClubStatus();
  setInterval(updateClubStatus, 1000);

  /* -----------------------------------------------
     TIMING BARS ANIMATE ON REVEAL
  ----------------------------------------------- */
  const timingBars = document.querySelectorAll(".timing-bar-fill");
  const timingDashboard = document.querySelector(".timings-dashboard");
  if (timingDashboard) {
    const barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          timingBars.forEach(function (bar) {
            const currentWidth = bar.style.width;
            bar.style.width = "0%";
            requestAnimationFrame(function () {
              setTimeout(function () {
                bar.style.width = currentWidth;
              }, 100);
            });
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barObserver.observe(timingDashboard);
  }

  /* -----------------------------------------------
     BOOKING FORM (Mock Submission)
  ----------------------------------------------- */
  const bookingForm = document.getElementById("bookingForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnText = document.getElementById("submitBtnText");
  const formSuccess = document.getElementById("formSuccess");
  const preferredDateInput = document.getElementById("preferredDate");

  if (preferredDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = pad(today.getMonth() + 1);
    const dd = pad(today.getDate());
    preferredDateInput.setAttribute("min", yyyy + "-" + mm + "-" + dd);
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const requiredFields = bookingForm.querySelectorAll("[required]");
    let allValid = true;
    requiredFields.forEach(function (field) {
      if (!field.value.trim()) {
        allValid = false;
        field.style.borderColor = "#ff4444";
      } else {
        field.style.borderColor = "";
      }
    });

    if (!allValid) {
      return;
    }

    submitBtn.disabled = true;
    submitBtnText.textContent = "Sending...";

    setTimeout(function () {
      submitBtnText.textContent = "Submit Booking Query";
      submitBtn.disabled = false;
      formSuccess.classList.add("visible");
      bookingForm.reset();

      setTimeout(function () {
        formSuccess.classList.remove("visible");
      }, 6000);
    }, 1400);
  });

  /* -----------------------------------------------
     FOOTER — CURRENT YEAR
  ----------------------------------------------- */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
