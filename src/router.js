import { isAuthenticated, handleCallback } from './auth.js';

const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

async function handleRoute() {
  const path = window.location.pathname;
  const app = document.getElementById('app');

  // Cleanup previous page
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  // Handle callback route
  if (path === '/callback') {
    app.innerHTML = `
      <div class="loading-screen">
        <div class="loading-spinner"></div>
        <p>Spotify'a bağlanılıyor...</p>
      </div>
    `;
    const token = await handleCallback();
    if (token) {
      window.history.replaceState({}, '', '/');
      handleRoute();
    } else {
      window.history.replaceState({}, '', '/');
      handleRoute();
    }
    return;
  }

  // Auth guard — redirect to login if not authenticated
  if (path !== '/' && !isAuthenticated()) {
    navigate('/');
    return;
  }

  // Show login page if not authenticated and on home
  if (path === '/' && !isAuthenticated()) {
    const loginRoute = routes['/login'];
    if (loginRoute) {
      const cleanup = await loginRoute(app);
      if (typeof cleanup === 'function') currentCleanup = cleanup;
    }
    return;
  }

  // Show home page if authenticated and on root
  if (path === '/' && isAuthenticated()) {
    const homeRoute = routes['/home'];
    if (homeRoute) {
      const cleanup = await homeRoute(app);
      if (typeof cleanup === 'function') currentCleanup = cleanup;
    }
    return;
  }

  // Match registered routes
  const handler = routes[path];
  if (handler) {
    const cleanup = await handler(app);
    if (typeof cleanup === 'function') currentCleanup = cleanup;
  } else {
    app.innerHTML = `
      <div class="error-page">
        <h1>404</h1>
        <p>Sayfa bulunamadı</p>
        <a href="/" class="btn btn-primary">Ana Sayfa</a>
      </div>
    `;
  }
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  handleRoute();
}

export function initRouter() {
  window.addEventListener('popstate', handleRoute);

  // Intercept link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      navigate(link.getAttribute('href'));
    }
  });

  handleRoute();
}
