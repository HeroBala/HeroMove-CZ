/* ======================================================
🚀 HERO MOVE — PRO MULTI-FORM MASTER SCRIPT (PRODUCTION)
Render + FastAPI + Resend — Stable Version
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
  🔥 WAKE RENDER BACKEND EARLY
  ===================================== */
  window.addEventListener("load", () => {
    fetch("https://heromove-cz.onrender.com/health")
      .catch(() => console.debug("Backend waking up..."));
  });
  /* =====================================
  ⭐ PREMIUM NAVBAR SCROLL EFFECT
  ===================================== */

  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {

  if(window.scrollY > 40){
  nav.style.background = "rgba(2,6,23,0.75)";
  nav.style.backdropFilter = "blur(14px)";
  nav.style.boxShadow = "0 8px 25px rgba(0,0,0,.35)";
  }
  else{
  nav.style.background = "#020617";
  nav.style.backdropFilter = "none";
  nav.style.boxShadow = "none";
  }

  });

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
  if (rocket) setTimeout(() => rocket.classList.add("fly"), 800);

    /* =====================================
  ⭐ HERO PARALLAX DEPTH
  ===================================== */

  const hero = document.querySelector(".hero-banner");

  if(hero){

  hero.addEventListener("mousemove",(e)=>{

  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  hero.style.transform = `translate(${x}px, ${y}px)`;

  });

  }

  /* =====================================
  🚀 STEP FORM ENGINE
  ===================================== */

  const steps = document.querySelectorAll(".step-page");

  if (steps.length) {

    let currentStep = 0;
    const indicators = document.querySelectorAll(".step");
    const submitBtn = document.querySelector(".submit-btn");

    function showStep(index){

      const intro = document.getElementById("fleetIntro");

      if(intro){
        intro.style.display = index === 0 ? "block" : "none";
      }

      steps.forEach((s,i)=>{
        s.style.display = i === index ? "block" : "none";
      });

      indicators.forEach((d,i)=>{
        d.classList.toggle("active", i === index);
      });

      const nextBtn = document.querySelector(".btn-main:not(.submit-btn)");

      if(submitBtn){
        const lastStep = index === steps.length-1;
        submitBtn.style.display = lastStep ? "inline-block" : "none";
        if(nextBtn){
          nextBtn.style.display = lastStep ? "none" : "inline-block";
        }
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function validateCurrentStep(){

      const currentFieldset = steps[currentStep];
      if(!currentFieldset) return true;

      const inputs = currentFieldset.querySelectorAll("input, select, textarea");

      for(const input of inputs){
        if(!input.checkValidity()){
          input.reportValidity();
          return false;
        }
      }

      return true;
    }

    window.nextStep = function(){
      if(!validateCurrentStep()) return;
      currentStep++;
      if(currentStep >= steps.length) currentStep = steps.length-1;
      showStep(currentStep);
    }

    window.prevStep = function(){
      currentStep--;
      if(currentStep < 0) currentStep = 0;
      showStep(currentStep);
    }

    showStep(currentStep);
  }

  /* =====================================
  🚀 PLATFORM + VEHICLE TOGGLES
  ===================================== */

  document.addEventListener("change", (e) => {

    if(e.target.id === "platformSelect"){

      const platform = e.target.value;

      document.querySelectorAll(".platform-bolt").forEach(el=>el.style.display="none");
      document.querySelectorAll(".platform-wolt").forEach(el=>el.style.display="none");

      if(platform==="bolt"){
        document.querySelectorAll(".platform-bolt").forEach(el=>el.style.display="block");
      }

      if(platform==="wolt"){
        document.querySelectorAll(".platform-wolt").forEach(el=>el.style.display="block");
      }

      const serviceInput = document.getElementById("serviceType");

      if(serviceInput){
        if(platform === "bolt"){
          serviceInput.value = "Bolt Fleet Application";
        }
        else if(platform === "wolt"){
          serviceInput.value = "Wolt Fleet Application";
        }
        else if(platform === "foodora"){
          serviceInput.value = "Foodora Fleet Application";
        }
        else{
          serviceInput.value = "Fleet Courier Application";
        }
      }
    }

    if(e.target.id === "vehicleType"){
      const show =
        e.target.value === "Scooter" ||
        e.target.value === "Car";

      const box = document.querySelector(".vehicle-license");
      if(box) box.style.display = show ? "block" : "none";
    }

  });

  /* =====================================
  🚀 HERO MOVE — PRO MULTI FORM ENGINE
  ===================================== */

  const forms = document.querySelectorAll("form.heroForm");

  forms.forEach(form => {

    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.dataset.loading === "true") return;

      try {

        const formData = new FormData(form);
        const endpoint = form.dataset.endpoint || "/send-booking";
        const url = "https://heromove-cz.onrender.com" + endpoint;

        if (submitBtn) {
          submitBtn.dataset.loading = "true";
          submitBtn.dataset.original = submitBtn.innerHTML;
          submitBtn.innerHTML = "🚀 Connecting securely...";
          submitBtn.disabled = true;
        }

        /* ============================
        🚀 AUTO RETRY REQUEST ENGINE
        ============================ */
        async function sendRequest(retry = false){

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 45000);

          try{

            const res = await fetch(url, {
              method: "POST",
              body: formData,
              headers: { "Accept": "application/json" },
              signal: controller.signal
            });

            clearTimeout(timeout);

            if(!res.ok) throw new Error("Server error");

            return await res.json();

          }catch(err){

            clearTimeout(timeout);

            if(!retry){
              console.log("⏳ Backend waking — retrying automatically...");
              await new Promise(r => setTimeout(r, 5000));
              return await sendRequest(true);
            }

            throw err;
          }
        }

        const result = await sendRequest();

        showHeroToast(
          result.message || "✅ Request sent successfully",
          true
        );

        form.reset();

      } catch (err) {

        console.error("FORM ERROR:", err);

        if (err.name === "AbortError") {
          showHeroToast("⚠️ Server waking up… please wait", false);
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

/* =====================================
⭐ HERO MOVE — ELITE SCROLL REVEAL ENGINE (FIXED)
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const revealTargets = document.querySelectorAll(
    ".section, .flow-card, .card, .feature-card, .event-card, .award-section"
  );

  const observer = new IntersectionObserver((entries, obs) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){
        entry.target.classList.add("active");
        obs.unobserve(entry.target); // animate once only
      }

    });

  },{
    threshold:0.12,
    rootMargin:"0px 0px -60px 0px"
  });

  revealTargets.forEach(el => {
    el.classList.add("reveal"); // ⭐ THIS WAS MISSING
    observer.observe(el);
  });

});