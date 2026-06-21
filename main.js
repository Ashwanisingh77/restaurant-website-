import './style.css'
import { supabase } from './supabase.js'

const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuCategories = document.querySelectorAll('.menu-category');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');

  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navMenu.classList.contains('active')
    ? 'rotate(45deg) translate(7px, 7px)'
    : 'none';
  spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
  spans[2].style.transform = navMenu.classList.contains('active')
    ? 'rotate(-45deg) translate(7px, -7px)'
    : 'none';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    menuCategories.forEach(cat => {
      if (cat.dataset.category === category) {
        cat.classList.add('active');
      } else {
        cat.classList.remove('active');
      }
    });
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.menu-item, .gallery-item, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

const reservationForm = document.getElementById('reservation-form');
const formMessage = document.getElementById('form-message');

const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

reservationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    guests: document.getElementById('guests').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    message: document.getElementById('message').value || null,
    status: 'pending'
  };

  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([formData])
      .select();

    if (error) throw error;

    formMessage.textContent = 'Reservation submitted successfully! We will contact you shortly at ' + formData.email + '.';
    formMessage.className = 'form-message success';
    reservationForm.reset();
  } catch (error) {
    console.error('Error submitting reservation:', error);
    formMessage.textContent = 'Sorry, there was an error submitting your reservation. Please try again or call us directly.';
    formMessage.className = 'form-message error';
  }

  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
});
