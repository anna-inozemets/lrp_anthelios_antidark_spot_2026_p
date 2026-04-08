// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 3;

// additional varibles for slides
const totalSlideAmount = 7;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 2.5,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--1__content h2', { opacity: 0, duration: 0.75, delay: 0.75 });
    typewriterEffect('.slide--1__content h3', 0.4, 1.5);
    gsap.from('.slide--1__content h4', { opacity: 0, duration: 0.75, delay: 2 });
    nextArrowDelay = 3;
  },
  2: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    gsap.from('.slide--2__left', { opacity: 0, duration: 0.75, delay: 0.75, x: -30 });
    gsap.from('.slide--2__right-top', { opacity: 0, duration: 0.75, delay: 1.25, y: 30 });
    gsap.from('.slide--2__right-center', { opacity: 0, duration: 0.75, delay: 1.5, y: 30 });
    gsap.from('.slide--2__right-bottom', { opacity: 0, duration: 0.75, delay: 1.75, y: 30 });
    nextArrowDelay = 2.75;
  },
  3: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--3 .animate-1', { opacity: 0, duration: 0.75, delay: 0.75, y: 20 });
    gsap.from('.slide--3 .animate-2', { opacity: 0, duration: 0.75, delay: 1.25, y: 20 });
    gsap.from('.slide--3 .animate-3', { opacity: 0, duration: 0.75, delay: 1.5, y: 20 });
    gsap.from('.slide--3 .animate-4', { opacity: 0, duration: 0.75, delay: 1.75, y: 20 });
    gsap.from('.slide--3 .animate-5', { opacity: 0, duration: 0.75, delay: 2, y: 20 });
    gsap.from('.slide--3 .animate-6', { opacity: 0, duration: 0.75, delay: 2.25, y: 20 });
    gsap.from('.slide--3 .animate-7', { opacity: 0, duration: 0.75, delay: 2.5, y: 20 });
    gsap.from('.slide--3 .animate-8', { opacity: 0, duration: 0.75, delay: 3 });
    nextArrowDelay = 4;
  },
  4: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');

    $('.slide--4__center').on('click', function() {
      $(this).addClass('active');

      gsap.to('.slide--4 img.molecul--1, .slide--4__left', { opacity: 1, duration: 1, delay: 0.5, scale: 1, x: 0 });
      gsap.to('.slide--4 img.molecul--2, .slide--4__right', { opacity: 1, duration: 1, delay: 1, scale: 1, x: 0 });

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 3 * 1000);
    });
  },
  5: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    gsap.from('.slide--5__right-content .wrapper', { opacity: 0, duration: 0.75, delay: 0.75 });
    gsap.from('.slide--5__left .content', { opacity: 0, duration: 0.75, delay: 1.25, x: 20 });
    nextArrowDelay = 2.25;
  },
  6: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    $('.slide--6__block').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).find('div'), { opacity: 1, duration: 1, delay: 0.5, x: 0 });

      if ($('.slide--6__block.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  7: () => {
    gsap.from('.slide--7__right h3', { opacity: 0, duration: 0.75, delay: 0.75 });
    gsap.from('.slide--7__right .block--1', { opacity: 0, duration: 0.75, delay: 1.5, x: 20, rotate: 5 });
    gsap.from('.slide--7__right .block--2', { opacity: 0, duration: 0.75, delay: 1.75, x: 20, rotate: 5 });

    gsap.delayedCall(3, function () {
      $('.slide--7 button.close-presentation').addClass('visible');
    });

    $('.slide--7 button.close-presentation').on('click', function() {
      $(this).addClass('clicked');
      lastSlideAction();
    })
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 4:
    case 6:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
