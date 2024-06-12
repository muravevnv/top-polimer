const menu = document.querySelector('.js-header-menu');
const menuToggler = document.querySelector('.js-header-menu-toggler');

menuToggler.addEventListener('click', () => {
  menu.classList.toggle('is-open');
  menuToggler.classList.toggle('is-active');
})