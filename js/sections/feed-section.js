window.sections = window.sections || {};
window.sections.feed = `
  <div class="container">
    <div class="section-head">
      <span class="section-kicker">Laporan Komunitas</span>
      <h2 id="feed-title" class="section-title">Laporan Terbaru</h2>
      <p class="section-sub">Laporan penipuan terbaru dari komunitas atau pengalaman orang-orang. Tersimpan di perangkat Anda dan langsung ter-update saat Anda melaporkan.</p>
      <div class="feed-toolbar">
        <div class="search-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input id="feed-filter" type="search" placeholder="Cari alamat situs atau jenis penipuan..." aria-label="Cari laporan">
        </div>
        <span id="feed-count" class="feed-count mono"></span>
      </div>
    </div>
    <div id="feed-list" class="feed-grid" aria-live="polite"></div>
  </div>
`;