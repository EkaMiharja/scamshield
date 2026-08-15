window.sections = window.sections || {};
window.sections.scanner = `
  <div class="container">
    <div class="hero">
      <h1 id="scanner-title" class="hero-title">Cek. Deteksi. <span class="grad-text">Laporkan.</span><br>Tetap Aman.</h1>
      <p class="hero-sub">ScamShield Hub memeriksa alamat situs mencurigakan langsung di perangkat Anda. Tanpa server, tanpa pelacakan, tanpa mengirim data ke mana pun.</p>

      <form id="scan-form" class="search-bar" role="search" aria-label="Cek alamat situs">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="url-input" type="text" inputmode="url" placeholder="Masukkan alamat situs untuk diperiksa" aria-label="Alamat situs yang ingin diperiksa" autocomplete="off" spellcheck="false">
        <button id="analyze-btn" class="btn-primary" type="submit">
          <span class="btn-label">Cek Situs</span>
          <span class="btn-spinner" aria-hidden="true"></span>
        </button>
      </form>

      <dl class="hero-stats">
        <div class="stat">
          <dt class="stat-num">&lt;100ms</dt>
          <dd class="stat-label">Pemeriksaan instan</dd>
        </div>
        <div class="stat">
          <dt class="stat-num">0</dt>
          <dd class="stat-label">Data keluar perangkat</dd>
        </div>
        <div class="stat">
          <dt class="stat-num">24/7</dt>
          <dd class="stat-label">Bisa dipakai offline</dd>
        </div>
      </dl>
    </div>
  </div>
`;