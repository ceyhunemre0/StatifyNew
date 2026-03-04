import { getUserProfile } from '../api.js';
import { getTopArtists, getTopTracks } from '../api.js';
import { logout } from '../auth.js';
import { navigate } from '../router.js';

export async function renderHome(app) {
  // Show loading state
  app.innerHTML = `
    <div class="loading-screen">
      <div class="loading-spinner"></div>
      <p>Veriler yükleniyor...</p>
    </div>
  `;

  // Fetch data in parallel
  const [profile, artistsData, tracksData] = await Promise.all([
    getUserProfile(),
    getTopArtists('short_term', 3),
    getTopTracks('short_term', 3)
  ]);

  if (!profile) return;

  const artists = artistsData?.items || [];
  const tracks = tracksData?.items || [];
  const profileImage = profile.images?.[0]?.url || '';

  app.innerHTML = `
    <div class="dashboard">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-brand" data-link href="/">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span class="brand-text">Statify</span>
        </div>
        <div class="navbar-right">
          <div class="user-info">
            ${profileImage ? `<img src="${profileImage}" alt="${profile.display_name}" class="user-avatar" />` : '<div class="user-avatar-placeholder"></div>'}
            <span class="user-name">${profile.display_name || 'Kullanıcı'}</span>
          </div>
          <button id="logout-btn" class="btn btn-ghost">Çıkış</button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg">
          <div class="hero-gradient"></div>
        </div>
        <div class="hero-content">
          <h1 class="hero-title">Merhaba, <span class="text-gradient">${profile.display_name?.split(' ')[0] || 'Kullanıcı'}</span> 👋</h1>
          <p class="hero-subtitle">İşte son zamanlardaki dinleme özetin</p>
        </div>
      </section>

      <!-- Top Artists Section -->
      <section class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span class="section-icon">🎤</span>
              En Çok Dinlediğin Sanatçılar
            </h2>
            <p class="section-subtitle">Bu ayki favorilerin</p>
          </div>
          <a href="/top-artists" data-link class="btn btn-outline">Tümünü Gör →</a>
        </div>
        <div class="top-artists-grid">
          ${artists.map((artist, i) => `
            <div class="artist-card animate-slide-up" style="animation-delay: ${i * 0.1}s">
              <div class="artist-rank">#${i + 1}</div>
              <div class="artist-image-container">
                <img src="${artist.images?.[0]?.url || ''}" alt="${artist.name}" class="artist-image" />
                <div class="artist-image-overlay"></div>
              </div>
              <h3 class="artist-name">${artist.name}</h3>
              <p class="artist-genres">${artist.genres?.slice(0, 2).join(', ') || 'Müzik'}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Top Tracks Section -->
      <section class="section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span class="section-icon">🎵</span>
              En Çok Dinlediğin Şarkılar
            </h2>
            <p class="section-subtitle">Bu ayki hit'lerin</p>
          </div>
          <a href="/top-tracks" data-link class="btn btn-outline">Tümünü Gör →</a>
        </div>
        <div class="top-tracks-list">
          ${tracks.map((track, i) => `
            <div class="track-card animate-slide-up" style="animation-delay: ${i * 0.1}s">
              <div class="track-rank">#${i + 1}</div>
              <img src="${track.album?.images?.[0]?.url || ''}" alt="${track.name}" class="track-album-art" />
              <div class="track-info">
                <h3 class="track-name">${track.name}</h3>
                <p class="track-artist">${track.artists?.map(a => a.name).join(', ')}</p>
              </div>
              <a href="${track.external_urls?.spotify}" target="_blank" rel="noopener" class="track-play-btn" title="Spotify'da aç">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </a>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>Statify ile müzik zevkini keşfet 🎧</p>
        <p class="footer-small">Spotify API ile desteklenmektedir</p>
      </footer>
    </div>
  `;

  // Event listeners
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', logout);

  return () => {
    logoutBtn.removeEventListener('click', logout);
  };
}
