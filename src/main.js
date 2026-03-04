import { registerRoute, initRouter } from './router.js';
import { renderLogin } from './pages/login.js';
import { renderHome } from './pages/home.js';
import { renderTopArtists } from './pages/topArtists.js';
import { renderTopTracks } from './pages/topTracks.js';
import './style.css';

// Register routes
registerRoute('/login', renderLogin);
registerRoute('/home', renderHome);
registerRoute('/top-artists', renderTopArtists);
registerRoute('/top-tracks', renderTopTracks);

// Initialize
initRouter();
