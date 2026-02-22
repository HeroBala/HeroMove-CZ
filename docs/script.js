/* ======================================================
   🚀 HERO MOVE — MASTER SCRIPT ENGINE (FINAL VERSION)
   Keeps ALL features + Universal Backend Forms
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     MOBILE MENU
  ===================================== */
  window.toggleMobileMenu = function(){
    const navLinks = document.querySelector('.nav-links');
    if(navLinks) navLinks.classList.toggle('active');
  };

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.querySelector('.nav-links');
      if(nav) nav.classList.remove('active');
    });
  });

  /* =====================================
     CARD HOVER ANIMATION
  ===================================== */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px) scale(1.03)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  /* =====================================
     CAREERS FAQ ENGINE
  ===================================== */
  const faqContainer = document.querySelector('.careers-faq-container');

  if (faqContainer) {

    console.debug('FAQ engine active');

    faqContainer.querySelectorAll('.careers-faq-question').forEach(q => {
      q.setAttribute('role','button');
      q.setAttribute('tabindex','0');
    });

    const toggleItem = (item) => {

      const answer = item.querySelector('.careers-faq-answer');
      if(!answer) return;

      const isOpen = item.classList.toggle('open');

      if(isOpen){
        faqContainer.querySelectorAll('.careers-faq-item.open').forEach(other=>{
          if(other!==item){
            other.classList.remove('open');
            const a = other.querySelector('.careers-faq-answer');
            if(a){
              a.style.maxHeight=null;
              a.classList.remove('active');
            }
          }
        });

        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight+"px";

      }else{
        answer.style.maxHeight="0px";
        setTimeout(()=>answer.classList.remove('active'),420);
      }
    };

    faqContainer.addEventListener('click',(e)=>{
      const item = e.target.closest('.careers-faq-item');
      const question = e.target.closest('.careers-faq-question');
      if(!item || !question) return;
      e.preventDefault();
      toggleItem(item);
    });
  }

  /* =====================================
     HERO ROCKET AUTO ANIMATION
  ===================================== */
  const rocket = document.querySelector(".hero-rocket");
  if(rocket){
    setTimeout(()=> rocket.classList.add("fly"),800);
  }

  /* =====================================
     🚀 UNIVERSAL HEROFORM ENGINE
     AUTO CONNECT ALL FORMS
  ===================================== */

  const forms = document.querySelectorAll("form.heroForm");

  if(!forms.length){
    console.debug("🚀 No heroForm found on this page");
  }

  forms.forEach(form => {

    if(form.dataset.bound==="true") return;
    form.dataset.bound="true";

    form.addEventListener("submit", async (e)=>{

      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');

      if(submitBtn && submitBtn.dataset.loading==="true") return;

      try{

        const formData = new FormData(form);

        if(submitBtn){
          submitBtn.dataset.loading="true";
          submitBtn.dataset.original = submitBtn.innerHTML;
          submitBtn.innerHTML="⏳ Sending...";
          submitBtn.disabled=true;
        }

        console.log("🚀 Sending:",Object.fromEntries(formData.entries()));

        const res = await fetch("https://heromove-cz.onrender.com",{
          method:"POST",
          body:formData
        });

        const result = await res.json();

        showHeroToast(result.message || "Request sent successfully",true);

        form.reset();

      }catch(err){

        console.error("FORM ERROR:",err);
        showHeroToast("❌ Failed to send request",false);

      }finally{

        if(submitBtn){
          submitBtn.innerHTML = submitBtn.dataset.original || "Submit";
          submitBtn.dataset.loading="false";
          submitBtn.disabled=false;
        }
      }

    });

  });

}); // ✅ ONLY ONE DOMContentLoaded


/* =====================================
   🚀 HERO TOAST NOTIFICATION SYSTEM
===================================== */

function showHeroToast(message, success=true){

  const toast=document.createElement("div");

  toast.innerText=message;

  Object.assign(toast.style,{
    position:"fixed",
    bottom:"30px",
    left:"50%",
    transform:"translateX(-50%)",
    padding:"14px 22px",
    borderRadius:"12px",
    color:"#fff",
    fontWeight:"600",
    zIndex:"9999",
    boxShadow:"0 8px 30px rgba(0,0,0,0.2)",
    background: success ? "#22c55e" : "#ef4444",
    opacity:"0",
    transition:"all .4s ease"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(()=> toast.style.opacity="1");

  setTimeout(()=>{
    toast.style.opacity="0";
    setTimeout(()=>toast.remove(),400);
  },3000);
}