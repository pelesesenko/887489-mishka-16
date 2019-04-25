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

let resizeHandler = (ms) => {
    let isThrottled = false;
    let wrapper = () => {
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
        setTimeout(() => {
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
    let nameModal = '"' + modalWindows[i].dataset.modal + '"';
    modalWindows[i].openers = document.querySelectorAll(`[data-modal-opener=${nameModal}]`);
    for (let j = 0; j < modalWindows[i].openers.length; j++) {
        modalWindows[i].openers[j].addEventListener("click", (event) => {
            event.preventDefault();
            modalWindows[i].classList.add("modal--show");
        })
    }
    modalWindows[i].closingBtn = modalWindows[i].querySelector('[data-modal-btn]');
    modalWindows[i].closingBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modalWindows[i].classList.remove("modal--show");
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
