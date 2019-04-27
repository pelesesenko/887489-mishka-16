'use strict'
let menuToggleBtn = document.querySelector('[data-mobile-menu="toggle"]');
let menuItems = document.querySelectorAll('[data-mobile-menu="item"]');
let isMenuOpen = true;
let isMobile = false;


function openMenu() {
  menuToggleBtn.classList.add('page-header__btn-menu--close');
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].style.display = '';
    isMenuOpen = true;
  }
}

function closeMenu() {
  menuToggleBtn.classList.remove('page-header__btn-menu--close');
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].style.display = 'none';
    isMenuOpen = false;
  }
}

function toggleMenu() {
  if (isMenuOpen) {
    closeMenu();
    return;
  }
  openMenu();
}

if (document.documentElement.clientWidth < 768) {
  isMobile = true;
  closeMenu();
  menuToggleBtn.addEventListener('click', toggleMenu);
  menuToggleBtn.style.display = 'block';
}

let resizeHandler = function(ms) {
  let isThrottled = false;
  let wrapper = function() {
    if (isThrottled) return;
    isThrottled = true;
    if (document.documentElement.clientWidth < 768 && isMobile === false) {
      isMobile = true;
      closeMenu();
      menuToggleBtn.style.display = 'block';
      menuToggleBtn.addEventListener('click', toggleMenu);
    }
    if (document.documentElement.clientWidth >= 768 && isMobile === true) {
      isMobile = false;
      openMenu();
      menuToggleBtn.style.display = '';
      menuToggleBtn.removeEventListener('click', toggleMenu);
    }
    setTimeout(function() {
      isThrottled = false;
      wrapper();
    }, ms)
  }
  return wrapper;
}

window.addEventListener("resize", resizeHandler(50));

//////////////////////////////////////////////////////////////////////////////////

let modalWindows = document.querySelectorAll('[data-modal]');

for (let i = 0; i < modalWindows.length; i++) {
  let modalWindow = modalWindows[i];
  let selector = '[data-modal-opener=' + '"' + modalWindow.dataset.modal + '"' + ']';
  modalWindow.openers = document.querySelectorAll(selector);

  for (let j = 0; j < modalWindow.openers.length; j++) {
    modalWindow.openers[j].addEventListener("click", function(event) {
      event.preventDefault();
      modalWindow.classList.add("modal--show");
    })
  }
  modalWindow.closingBtn = modalWindow.querySelector('[data-modal-btn]');
  modalWindow.closingBtn.addEventListener("click", function(event) {
    event.preventDefault();
    modalWindow.classList.remove("modal--show");
  })
}

window.addEventListener("keydown", function(evt) {
  if (evt.keyCode == 27) {
    for (let i = 0; i < modalWindows.length; i++) {
      if (modalWindows[i].classList.contains("modal--show")) {
        evt.preventDefault();
        modalWindows[i].classList.remove("modal--show");
      }
    }
  }
});
