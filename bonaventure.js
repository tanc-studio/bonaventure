//<script src="https://8cvd38-5000.csb.app/bon.js"></script> 

// Page Scroll-----------------------------------------------------------
let lenis
if (Webflow.env('editor') === undefined) {
  lenis = new Lenis({
    lerp: 0.03,
    wheelMultiplier: 1,
    gestureOrientation: 'vertical',
    normalizeWheel: false,
    smoothTouch: false,
  })
  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)}
  requestAnimationFrame(raf)}
  

$('[data-lenis-start]').on('click', function () {lenis.start()})
$('[data-lenis-stop]').on('click', function () { lenis.stop()})
$('[data-lenis-toggle]').on('click', function () {
  $(this).toggleClass('stop-scroll')
  if ($(this).hasClass('stop-scroll')) {
    lenis.stop()
  } else {
    lenis.start()
}})
lenis.stop()

$(document).ready(function () {
  lenis.start()})

// Page Transition ----------------------------------------------------------
let transitionTrigger = $('.transition-trigger')
let introDurationMS = 1000
let exitDurationMS = 1400
let excludedClass = 'no-transition'

if (transitionTrigger.length > 0) {
  transitionTrigger.click()
  $('body').addClass('no-scroll-transition')
  setTimeout(() => {
    $('body').removeClass('no-scroll-transition')
  }, introDurationMS)
}
$('a').on('click', function (e) {
  if (
    $(this).prop('hostname') == window.location.host &&
    $(this).attr('href').indexOf('#') === -1 &&
    !$(this).hasClass(excludedClass) &&
    $(this).attr('target') !== '_blank' &&
    transitionTrigger.length > 0
  ) {
    e.preventDefault()
    $('body').addClass('no-scroll-transition')
    let transitionURL = $(this).attr('href')
    transitionTrigger.click()
    setTimeout(function () {
      window.location = transitionURL
    }, exitDurationMS)
  }})
window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload()
  }}

setTimeout(() => {
  $(window).on('resize', function () {
    setTimeout(() => {
      $('.transition').css('display', 'none')
    }, 50)
  })
}, introDurationMS)



// Page Grids -----------------------------------------------------------

gsap.registerPlugin(ScrollTrigger);
let cardInfoTimelines = [];
function runGsapAnimations() {
  clearGsapAnimations();
  const isTabletOrSmaller = window.matchMedia("(max-width: 1024px)").matches;
  const baseDisplacements = {
    'fern-wall': '-45%',
    'season-autumn-wall': '-40%',
    'peacock-wall': '-10%',
    'tree-table': '-45%',
    'rose-stone-table': '-35%',
    'rose-silver-bracelet-table': '-35%',
    'bird-wall': '-30%',
    'flowers-wall': '-45%',
    'flowers-table': '-10%',
    'grasses-wall': '-25%',
    'swirl-table': '-15%',
    'dragonfly-wall': '-15%',
    'butterfly-wall': '-40%',
    'abbey-pendant': '-5%',
    'jasper-table': '0%',
    'eaton-table': '-45%',
    'jazz-table': '-30%',
    'venice-table': '-30%',
    'chiswick-table': '-35%',
    'fig-table': '-45%',
    'milan-table': '-40%',
    'portland-pendant': '-45%',
    'josef-table': '-45%',
    'berlin-table': '-35%',
    'flo-table': '-15%',
    'flo-wall': '-45%',
    'vetro-table': '-50%',
    'lens-wall': '-45%',
  };
  const tabletDisplacements = {
    'jasper-table': '-45%',
    'jazz-table': '-25%',   
    'fern-wall': '-30%',
    'season-autumn-wall': '-15%',
    'peacock-wall': '-25%',
    'butterfly-wall': '-15%',
    'jazz-table': '5%',
    'venice-table': '5%',
    'milan-table': '0%',
    'vetro-table': '-20%',
    'lens-wall': '-15%',
    'tree-table': '0%',
  };

  const targets = Object.entries(baseDisplacements).map(([productName, displacement]) => {
    return {
      selector: `.grid-abstract [product-name="${productName}"]`,
      displacement: isTabletOrSmaller ? (tabletDisplacements[productName] || displacement) : displacement
    };
  });

  targets.forEach(({ selector, displacement }) => {
    document.querySelectorAll(selector).forEach((element) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: '0% bottom',
          end: '100% top',
          scrub: 1
        },
      }).to(element, { y: displacement });
    });
  });

  document.querySelectorAll('.card-info').forEach((cardInfo) => {
    const cardInfoTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: cardInfo,
        start: 'top 100%',
        end: 'top 0%',
        scrub: true
      },
    })
    .fromTo(cardInfo, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 })
    .to(cardInfo, { autoAlpha: 0, y: 0, duration: 1 }, '+=0.5');

    cardInfoTimelines.push(cardInfoTimeline);
  });
}

function clearGsapAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  cardInfoTimelines.forEach((timeline) => timeline.kill());
  cardInfoTimelines = [];
}

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  applySavedIconState();
  setTimeout(addTransitionClassToCards, 500);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (gridContainer.classList.contains('grid-abstract') && window.innerWidth >= 767) {
    runGsapAnimations();
  }
});

const element = document.getElementById('mybtn');
const gridContainer = document.querySelector('.grid-container');

element.addEventListener('click', toggleGridAndIcon);

function toggleGridAndIcon() {
  removeTransitionClassFromCards();
  toggleGrid();
  toggleIcon();
  setTimeout(addTransitionClassToCards, 1000);}

function toggleGrid() {
  gridContainer.classList.toggle('grid-abstract');
  gridContainer.classList.toggle('grid-normal');
  clearGsapAnimations(); // Clear animations on toggle to reset state
  runGsapAnimations(); // Reinitialize animations for the new grid state

  const theme = gridContainer.classList.contains('grid-normal')
    ? 'GRIDNORMAL'
    : 'GRIDABSTRACT';
  localStorage.setItem('PageTheme', theme);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on grid toggle
  handleAlphabeticalSorting();}

function handleAlphabeticalSorting() {
  if (gridContainer.classList.contains('grid-normal')) {
    sortCardsAlphabetically();
  } else {
    resetCardOrder();
  }}

function sortCardsAlphabetically() {
  const cards = Array.from(gridContainer.querySelectorAll('.card'));
  const sortedCards = cards.sort((a, b) => {
    const productNameA = a.getAttribute('product-name').toLowerCase();
    const productNameB = b.getAttribute('product-name').toLowerCase();
    if (productNameA < productNameB) return -1;
    if (productNameA > productNameB) return 1;
    return 0;});
  const sortedCardsFromA = sortCardsByFirstLetter(sortedCards);
  sortedCardsFromA.forEach((card) => {
    gridContainer.appendChild(card);
  });}

function resetCardOrder() {
  const cards = Array.from(gridContainer.querySelectorAll('.card'));
  cards.forEach((card) => {
    gridContainer.appendChild(card);
  });}

function sortCardsByFirstLetter(cards) {
  const sortedByFirstLetter = [];
  const firstLetters = new Set(cards.map((card) => card.getAttribute('product-name')[0].toLowerCase()));

  for (const letter of firstLetters) {
    const cardsStartingWithLetter = cards.filter((card) => card.getAttribute('product-name')[0].toLowerCase() === letter);
    sortedByFirstLetter.push(...cardsStartingWithLetter);
  }

  return sortedByFirstLetter;
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('PageTheme')
  if (window.innerWidth > 767) {
    if (savedTheme === 'GRIDNORMAL') {
      gridContainer.classList.add('grid-normal')
      gridContainer.classList.remove('grid-abstract')
    } else {
      gridContainer.classList.add('grid-abstract')
      gridContainer.classList.remove('grid-normal')
    }
  } else {
    gridContainer.classList.add('grid-normal')
    gridContainer.classList.remove('grid-abstract')
  }
}

function toggleIcon() {
  const iconA = document.querySelector('.icon-a')
  const iconB = document.querySelector('.icon-b')

  if (iconA && iconB) {
    iconA.classList.toggle('icon-visible')
    iconB.classList.toggle('icon-visible')

    const visibleIcon = iconA.classList.contains('icon-visible') ? 'A' : 'B'
    sessionStorage.setItem('VisibleIcon', visibleIcon)
  }
}

function applySavedIconState() {
  const savedIcon = sessionStorage.getItem('VisibleIcon')
  const iconA = document.querySelector('.icon-a')
  const iconB = document.querySelector('.icon-b')

  if (iconA && iconB) {
    if (savedIcon === 'B') {
      iconA.classList.remove('icon-visible')
      iconB.classList.add('icon-visible')
    } else {
      iconA.classList.add('icon-visible')
      iconB.classList.remove('icon-visible')
    }
  }
}

function addTransitionClassToCards() {
  document.querySelectorAll('.card').forEach((card) => {
    card.classList.add('enable-transition')
  })
}

function removeTransitionClassFromCards() {
  document.querySelectorAll('.card').forEach((card) => {
    card.classList.remove('enable-transition')
  })
}

window.addEventListener('resize', applySavedTheme)
window.onload = function() {
  window.scrollTo(0, 0);
};

// Add this event listener
window.addEventListener('orientationchange', () => {
  clearGsapAnimations();
  runGsapAnimations();
});

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  applySavedIconState();
  setTimeout(addTransitionClassToCards, 500);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (gridContainer.classList.contains('grid-abstract') && window.innerWidth >= 767) {
    runGsapAnimations();
  }

  handleAlphabeticalSorting();
});


$('.burger').click(function() {
  var clicks = $(this).data('clicks');
  $(this).data("clicks", !clicks);
});

$(".overlay-menu").click(function() {
  $(".burger").click();
});