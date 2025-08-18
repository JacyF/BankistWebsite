'use strict';

// ELEMENTS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

// MODAL WINDOWS
// OPEN
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// CLOSE
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SCROLL BUTTON
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({
    behavior: 'smooth'
  })
})

// PAGE NAVIGATION
// EVENT DELEGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault()

  // MATCHING STRATEGY
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
})

// TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // GUARD CLAUSE
  if (!clicked) return;

  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });

  tabContent.forEach(content => content.classList.remove('operations__content--active'))

  clicked.classList.add('operations__tab--active');

  // ACTIVE CONTENT AREA
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

// MENU FADE ANIMATION
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {

    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })

    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVIGATION
const header = document.querySelector('.header');
const nabHeight = nav.getBoundingClientRect().height;

const stickNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nabHeight}px`,
});
headerObserver.observe(header);

// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  })
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
})

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // REPLACE SRC WITH DATA-SRC
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0.15,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDES
const slider = function () {

  let curSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length;
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // FUNCTIONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class='dots__dot' data-slide='${i}'></button>`)
    })
  }

  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100*(i-slide)}%)`);
  }

  // NEXT SLIDE
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  }

  // PREVIOUS SLIDE
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  }

  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0)
  }

  init();

  // EVENT HANDLER
  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {

    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {

      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activeDot(curSlide);
    }
  })
}

slider();