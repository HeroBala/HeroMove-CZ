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

// Smooth reveal animation for cards (keeps existing micro-animations)
document.querySelectorAll('.card').forEach(card => {
	card.addEventListener('mouseenter', () => {
		card.style.transform = 'translateY(-6px) scale(1.03)';
	});
	card.addEventListener('mouseleave', () => {
		card.style.transform = 'translateY(0) scale(1)';
	});
});

// Careers FAQ: use event delegation for robust handling
{
	const container = document.querySelector('.careers-faq-container');
	if (container) {
		// debug hook so we can check in browser console whether FAQ script ran
		console.debug('FAQ: careers-faq script initialized');
		// make each question focusable/accessibile
		container.querySelectorAll('.careers-faq-question').forEach(q => {
			if (!q.hasAttribute('role')) q.setAttribute('role', 'button');
			if (!q.hasAttribute('tabindex')) q.setAttribute('tabindex', '0');
		});

		const closeOthers = (except) => {
			container.querySelectorAll('.careers-faq-item.open').forEach(other => {
				if (other !== except) {
					other.classList.remove('open');
					const a = other.querySelector('.careers-faq-answer');
					if (a) { a.style.maxHeight = null; a.classList.remove('active'); }
				}
			});
		};

		const toggleItem = (item) => {
			if (!item) return;
			const answer = item.querySelector('.careers-faq-answer');
			if (!answer) return;

			// We use a small reflow technique to make the max-height transition smooth
			const isOpen = item.classList.toggle('open');
			if (isOpen) {
				// ensure other items are closed first
				closeOthers(item);
				answer.classList.add('active');
				// start from 0 to trigger transition reliably
				answer.style.maxHeight = '0px';
				// force reflow
				answer.offsetHeight;
				answer.style.maxHeight = answer.scrollHeight + 'px';
				// scroll the opened item into center after transition begins
				setTimeout(()=> item.scrollIntoView({behavior:'smooth', block:'center'}), 160);
			} else {
				// animate closing from current height to 0
				answer.style.maxHeight = answer.scrollHeight + 'px';
				answer.offsetHeight; // force reflow
				answer.style.maxHeight = '0px';
				// remove active class after transition time
				setTimeout(() => answer.classList.remove('active'), 420);
			}
		};

		// delegation: handle clicks on question or anywhere inside .careers-faq-item
		container.addEventListener('click', (e) => {
			const question = e.target.closest('.careers-faq-question');
			const item = e.target.closest('.careers-faq-item');
			if (!item || !question) return;
			// ignore clicks on links/buttons inside
			if (e.target.closest('a, button')) return;
			e.preventDefault();
			toggleItem(item);
		});

		// keyboard support
		container.addEventListener('keydown', (e) => {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			const question = e.target.closest('.careers-faq-question');
			const item = e.target.closest('.careers-faq-item');
			if (!item || !question) return;
			e.preventDefault();
			toggleItem(item);
		});

		// open first item by default for visibility
		const first = container.querySelector('.careers-faq-item');
		if (first) {
			first.classList.add('open');
			const a = first.querySelector('.careers-faq-answer');
			if (a) {
				a.classList.add('active');
				// ensure correct height after images/fonts load
				setTimeout(()=> { a.style.maxHeight = a.scrollHeight + 'px'; }, 80);
			}
		}

		// Recalculate open answer heights (useful if images or fonts change layout)
		const recalcOpenAnswers = () => {
			container.querySelectorAll('.careers-faq-item.open .careers-faq-answer').forEach(ans => {
				ans.style.maxHeight = ans.scrollHeight + 'px';
			});
		};

		// Recalc on load and when images inside the FAQ finish loading
		window.addEventListener('load', () => {
			recalcOpenAnswers();
			// in case some images load slightly later
			setTimeout(recalcOpenAnswers, 260);
		});

		// Also listen for individual image loads inside the container
		container.querySelectorAll('img').forEach(img => {
			if (!img.complete) img.addEventListener('load', recalcOpenAnswers);
		});
	}
}

// Advertisement/banner form: tab switching & submission
(function bannerFormInit(){
	const tabs = document.querySelectorAll('.ad-tab');
	const form = document.getElementById('ad-form');
	const typeInput = document.getElementById('ad-type');
	const responseBox = document.getElementById('form-response');

	if (!form) return;

	function showSection(type){
		// set hidden input
		if (typeInput) typeInput.value = type;
		// tab UI
		tabs.forEach(t => t.classList.toggle('active', t.dataset.type === type));
		// sections
		document.querySelectorAll('.form-section[data-section]').forEach(sec => {
			if (sec.dataset.section === type) sec.style.display = '';
			else sec.style.display = 'none';
		});
	}

	tabs.forEach(t => t.addEventListener('click', () => showSection(t.dataset.type)));

	// Clear action
	const clearBtn = document.getElementById('banner-clear');
	if (clearBtn) clearBtn.addEventListener('click', () => {
		form.reset();
		showSection('tour');
		responseBox.textContent = '';
	});

	// Submit handler: send to backend endpoint /send-email (if available)
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		responseBox.textContent = '';

		const formData = new FormData(form);
		const payload = {};
		formData.forEach((v,k) => payload[k] = v);

		// Build a message summary to send in the message field if service-specific fields exist
		const type = payload.type || 'tour';
		let details = '';
		if (type === 'tour'){
			details = `Tour dates: ${payload.tourDates || '-'}\nDetails: ${payload.tourDetails || '-'}`;
		} else if (type === 'dorm'){
			details = `Pickup: ${payload.pickup || '-'}\nDropoff: ${payload.dropoff || '-'}\nPassengers: ${payload.passengers || '-'} `;
		} else if (type === 'airport'){
			details = `Flight: ${payload.flightNumber || '-'}\nPickup: ${payload.airportPickup || '-'}\nDropoff: ${payload.airportDropoff || '-'} `;
		}

		// Append details into message body
		const finalMessage = `${details}\n\nNotes: ${payload.message || '-'} `;

		// Minimal client validation
		if (!payload.fullName || !payload.fullName.trim()){
			responseBox.textContent = 'Please provide your full name.';
			return;
		}
		if (!payload.email || !payload.email.match(/@/)){
			responseBox.textContent = 'Please provide a valid email address.';
			return;
		}

		// Prepare send payload aligned with backend expectations
		const sendPayload = {
			fullName: payload.fullName,
			email: payload.email,
			phone: payload.phone || '',
			message: `Request type: ${type}\n\n${finalMessage}`
		};

		try{
			responseBox.textContent = 'Sending...';
			const res = await fetch('/send-email', {
				method: 'POST',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify(sendPayload)
			});

			const json = await res.json().catch(()=>({success:false,message:'Invalid response from server'}));
			if (res.ok && json.success){
				responseBox.textContent = 'Request sent — we will contact you shortly.';
				form.reset();
				showSection('tour');
			} else {
				responseBox.textContent = json.message || 'Failed to send request. Please try again or use email/WhatsApp.';
			}
		}catch(err){
			console.error('Send error', err);
			responseBox.textContent = 'Network error — could not send request. You can contact us via email or WhatsApp.';
		}
	});

	// default show
	showSection('tour');
})();

// Ensure open FAQ answers adjust on resize (recalculate max-heights)
window.addEventListener('resize', () => {
	document.querySelectorAll('.careers-faq-item.open .careers-faq-answer').forEach(ans => {
		ans.style.maxHeight = ans.scrollHeight + 'px';
	});
});

/* HERO ROCKET AUTO ANIMATION */
window.addEventListener("load", () => {
	const rocket = document.querySelector(".hero-rocket");
	if(!rocket) return;

	setTimeout(()=>{
		rocket.classList.add("fly");
	}, 800); // delay so hero loads first
});
