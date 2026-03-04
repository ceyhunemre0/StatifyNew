import { getTopArtists, getUserProfile } from '../api.js';
import { logout } from '../auth.js';

const TIME_RANGES = [
  { key: 'short_term', label: 'Aylık' },
  { key: 'medium_term', label: '6 Aylık' },
  { key: 'long_term', label: 'Yıllık' }
];

let currentTimeRange = 'short_term';

async function loadArtists(container) {
  container.innerHTML = `
    <div class="loading-list">
      ${Array.from({ length: 10 }, () => `
        <div class="skeleton-item">
          <div class="skeleton skeleton-circle"></div>
          <div class="skeleton-text">
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line-sm"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const data = await getTopArtists(currentTimeRange, 20);
  const artists = data?.items || [];

  container.innerHTML = artists.map((artist, i) => `
    <div class="list-item animate-slide-up" style="animation-delay: ${i * 0.03}s">
      <div class="list-item-rank ${i < 3 ? 'top-rank' : ''}">${i + 1}</div>
      <img src="${artist.images?.[1]?.url || artist.images?.[0]?.url || ''}" alt="${artist.name}" class="list-item-image rounded" />
      <div class="list-item-info">
        <h3 class="list-item-title">${artist.name}</h3>
        <p class="list-item-subtitle">${artist.genres?.slice(0, 3).join(', ') || 'Müzik'}</p>
      </div>
      <div class="list-item-meta">
        <span class="popularity-badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          ${artist.popularity}
        </span>
      </div>
    </div>
  `).join('');
}

export async function renderTopArtists(app) {
  currentTimeRange = 'short_term';

  const profile = await getUserProfile();
  const profileImage = profile?.images?.[0]?.url || '';
  const profileName = profile?.display_name || 'Kullanıcı';

  app.innerHTML = `
    <div class="dashboard">
      <nav class="navbar">
        <div class="navbar-brand">
          <a href="/" data-link class="back-link">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </a>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span class="brand-text">Statify</span>
        </div>
        <div class="navbar-right">
          <div class="user-info">
            ${profileImage ? `<img src="${profileImage}" alt="${profileName}" class="user-avatar" />` : '<div class="user-avatar-placeholder"></div>'}
            <span class="user-name">${profileName}</span>
          </div>
          <button id="logout-btn" class="btn btn-ghost">Çıkış</button>
        </div>
      </nav>

      <div class="page-header">
        <h1 class="page-title">🎤 En Çok Dinlediğin Sanatçılar</h1>
        <div class="time-range-selector" id="time-range-selector">
          ${TIME_RANGES.map(tr => `
            <button class="time-range-btn ${tr.key === currentTimeRange ? 'active' : ''}" data-range="${tr.key}">
              ${tr.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="list-container" id="artists-list"></div>

      <footer class="footer">
        <p>Statify ile müzik zevkini keşfet 🎧</p>
      </footer>
    </div>
  `;

  const artistsList = document.getElementById('artists-list');
  const timeRangeSelector = document.getElementById('time-range-selector');
  const logoutBtn = document.getElementById('logout-btn');

  await loadArtists(artistsList);

  const handleTimeRange = async (e) => {
    const btn = e.target.closest('.time-range-btn');
    if (!btn) return;

    currentTimeRange = btn.dataset.range;

    // Update active state
    timeRangeSelector.querySelectorAll('.time-range-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    await loadArtists(artistsList);
  };

  timeRangeSelector.addEventListener('click', handleTimeRange);
  logoutBtn.addEventListener('click', logout);

  return () => {
    timeRangeSelector.removeEventListener('click', handleTimeRange);
    logoutBtn.removeEventListener('click', logout);
  };
}
