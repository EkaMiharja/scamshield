window.sections = window.sections || {};
window.sections.dashboard = `
  <div class="container">
    <div class="section-head">
      <span class="section-kicker">Hasil Analisis</span>
      <h2 id="dashboard-title" class="section-title">Hasil Pemeriksaan</h2>
      <div class="dashboard-url">
        <span id="dashboard-host" class="mono"></span>
        <span id="dashboard-badge" class="badge badge-muted"></span>
      </div>
    </div>

    <div id="match-alert" class="match-alert" hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
      <div class="match-body"></div>
      <a class="match-link" href="#feed">Lihat di Laporan Terbaru</a>
    </div>

    <div class="dashboard-grid">
      <div id="gauge-card" class="card gauge-card">
        <h3 class="card-title">Skor Kepercayaan</h3>
        <div id="gauge-container"></div>
        <p id="recommendation" class="recommendation"></p>
      </div>
      <div class="card">
        <h3 class="card-title">Daftar Cek Keamanan</h3>
        <ul id="checklist" class="checklist"></ul>
      </div>
      <div class="card">
        <h3 class="card-title">Rincian Risiko</h3>
        <ul id="breakdown" class="breakdown"></ul>
      </div>
    </div>
  </div>
`;