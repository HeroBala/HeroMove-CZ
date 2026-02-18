// Mobile menu toggle
function toggleMobileMenu(){
const navLinks = document.querySelector('.nav-links');
navLinks.classList.toggle('active');
}

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
link.addEventListener('click', () => {
document.querySelector('.nav-links').classList.remove('active');
});
});

// Smooth reveal animation
document.querySelectorAll(".card").forEach(card=>{
card.addEventListener("mouseenter",()=>{
card.style.transform="translateY(-6px) scale(1.03)";
});
card.addEventListener("mouseleave",()=>{
card.style.transform="translateY(0) scale(1)";
});
});

// FAQ Accordion Toggle
function toggleFAQ(element){
const faqItem=element.parentElement;
const answer=faqItem.querySelector(".faq-answer");

// Close other FAQs
document.querySelectorAll(".faq-item").forEach(item=>{
if(item!==faqItem){
item.classList.remove("open");
item.querySelector(".faq-answer").classList.remove("active");
}
});

// Toggle current FAQ
faqItem.classList.toggle("open");
answer.classList.toggle("active");
}
