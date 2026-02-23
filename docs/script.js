/* ======================================================
🚀 HERO MOVE — PRO MULTI-FORM MASTER SCRIPT (FINAL)
Production safe: Render + FastAPI + Resend
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
  🔥 WAKE RENDER BACKEND
  ===================================== */
  fetch("https://heromove-cz.onrender.com/health")
    .catch(() => console.debug("Backend waking up..."));

  /* =====================================
  MOBILE MENU
  ===================================== */
  window.toggleMobileMenu = function () {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) navLinks.classList.toggle("active");
  };

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      const nav = document.querySelector(".nav-links");
      if (nav) nav.classList.remove("active");
    });
  });

  /* =====================================
  CARD HOVER ANIMATION
  ===================================== */
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-6px) scale(1.03)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });

  /* =====================================
  CAREERS FAQ ENGINE
  ===================================== */
  const faqContainer = document.querySelector(".careers-faq-container");

  if (faqContainer) {

    faqContainer.querySelectorAll(".careers-faq-question").forEach(q => {
      q.setAttribute("role", "button");
      q.setAttribute("tabindex", "0");
    });

    const toggleItem = (item) => {
      const answer = item.querySelector(".careers-faq-answer");
      if (!answer) return;

      const isOpen = item.classList.toggle("open");

      if (isOpen) {
        faqContainer.querySelectorAll(".careers-faq-item.open").forEach(other => {
          if (other !== item) {
            other.classList.remove("open");
            const a = other.querySelector(".careers-faq-answer");
            if (a) {
              a.style.maxHeight = null;
              a.classList.remove("active");
            }
          }
        });

        answer.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";

      } else {
        answer.style.maxHeight = "0px";
        setTimeout(() => answer.classList.remove("active"), 420);
      }
    };

    faqContainer.addEventListener("click", (e) => {
      const item = e.target.closest(".careers-faq-item");
      const question = e.target.closest(".careers-faq-question");
      if (!item || !question) return;
      e.preventDefault();
      toggleItem(item);
    });
  }

  /* =====================================
  HERO ROCKET AUTO ANIMATION
  ===================================== */
  const rocket = document.querySelector(".hero-rocket");
  if (rocket) {
    setTimeout(() => rocket.classList.add("fly"), 800);
  }

  /* =====================================
  🚀 HERO MOVE — PRO MULTI FORM ENGINE
  ===================================== */
  const forms = document.querySelectorAll("form.heroForm");

  if (!forms.length) {
    console.debug("🚀 No heroForm found on this page");
  }

  forms.forEach(form => {

    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.dataset.loading === "true") return;

      try {

        const formData = new FormData(form);

        // ⭐ PRO: dynamic endpoint per form
        const endpoint = form.dataset.endpoint || "/send-booking";
        const url = "https://heromove-cz.onrender.com" + endpoint;

        if (submitBtn) {
          submitBtn.dataset.loading = "true";
          submitBtn.dataset.original = submitBtn.innerHTML;
          submitBtn.innerHTML = "⏳ Sending...";
          submitBtn.disabled = true;
        }

        console.log("🚀 Sending to:", url);
        console.log("📦 Data:", Object.fromEntries(formData.entries()));

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);

        const res = await fetch(url, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error("Server returned error");
        }

        const result = await res.json();

        showHeroToast(
          result.message || "✅ Request sent successfully",
          true
        );

        form.reset();

      } catch (err) {

        console.error("FORM ERROR:", err);

        if (err.name === "AbortError") {
          showHeroToast("⚠️ Server waking up… please try again", false);
        } else {
          showHeroToast("❌ Failed to send request", false);
        }

      } finally {

        if (submitBtn) {
          submitBtn.innerHTML = submitBtn.dataset.original || "Submit";
          submitBtn.dataset.loading = "false";
          submitBtn.disabled = false;
        }
      }
    });
  });

}); // ✅ DOM READY END


/* =====================================
🚀 HERO TOAST SYSTEM (GLOBAL)
===================================== */
function showHeroToast(message, success = true) {

  const toast = document.createElement("div");
  toast.innerText = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "14px 22px",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    zIndex: "9999",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    background: success ? "#22c55e" : "#ef4444",
    opacity: "0",
    transition: "all .4s ease"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.style.opacity = "1");

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}