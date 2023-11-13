import { showHome } from './pages/home/home.js';
import { showUser } from './pages/user/user.js';
import { showGame } from './pages/game/game.js';
import { showAbout } from './pages/about/about.js';
import { show404 } from './pages/404/404.js';


function showPage(pageFunction) {
  pageFunction();
}

function navigateTo(route) {
  history.pushState(null, null, route);
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname;
  const routes = {
    '/': showHome,
    '/about': showAbout,
    '/game': showGame,
    '/user': showUser,
    '/404': show404,
  };
  const pageFunction = routes[path] || routes['/404'];
  showPage(pageFunction);
}

// Load the page at first launch.
// will listen at everything that has the class "nav-link" in <nav> in index.html
document.addEventListener('DOMContentLoaded', () => {
  handleRoute()
  const navContainer = document.getElementById('navbar');
  navContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('nav-link')) {
      event.preventDefault();
      const route = target.getAttribute('data-route');
      navigateTo(route);
    }
  });

  window.addEventListener('popstate', handleRoute);
});
