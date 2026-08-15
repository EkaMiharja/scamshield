window.sections = window.sections || {};
window.sections.report = `
  <div class="container container-narrow">
    <div class="section-head section-head-center">
      <span class="section-kicker">Aksi Komunitas</span>
      <h2 id="report-title" class="section-title">Laporkan Penipuan</h2>
      <p class="section-sub">Temukan penipuan? Laporkan sekarang. Laporan Anda tersimpan aman di perangkat Anda dan langsung muncul di Laporan Terbaru.</p>
    </div>

    <form id="report-form" class="card report-form" novalidate>
      <div class="form-row">
        <div class="field">
          <label for="report-url">Alamat Situs yang Mencurigakan <span class="req" aria-hidden="true">*</span></label>
          <input id="report-url" type="text" inputmode="url" placeholder="contoh: promo-hadiah-besar.tk" autocomplete="off" spellcheck="false">
          <p class="field-error" hidden></p>
        </div>
        <div class="field">
          <label for="report-category">Jenis Penipuan <span class="req" aria-hidden="true">*</span></label>
          <select id="report-category">
            <option value="" selected disabled>Pilih jenis penipuan...</option>
            <option>Login / Tautan Palsu</option>
            <option>Penipuan Investasi</option>
            <option>Penipuan Online</option>
            <option>Penipuan Belanja Online</option>
            <option>Penipuan Media Sosial</option>
            <option>Pinjaman Online Ilegal</option>
            <option>Lainnya</option>
          </select>
          <p class="field-error" hidden></p>
        </div>
      </div>
      <div class="field">
        <label for="report-contact">Kontak Pelaku <span class="opt">(opsional)</span></label>
        <input id="report-contact" type="text" placeholder="Nomor WhatsApp, email, atau akun media sosial pelaku...">
      </div>
      <div class="field">
        <label for="report-chronology">Kronologi Kejadian <span class="req" aria-hidden="true">*</span></label>
        <textarea id="report-chronology" rows="4" placeholder="Ceritakan bagaimana penipuan terjadi, langkah demi langkah..."></textarea>
        <p class="field-error" hidden></p>
      </div>
      <div class="field">
        <label for="report-proof">Catatan Bukti <span class="opt">(opsional)</span></label>
        <textarea id="report-proof" rows="3" placeholder="Tulis nomor transaksi, tautan bukti, atau detail lainnya..."></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-primary btn-buy btn-block" type="submit">Kirim Laporan</button>
        <p class="form-hint">Data diproses 100% di perangkat Anda. Tanpa server, tanpa mengirim data ke mana pun.</p>
      </div>
    </form>
  </div>
`;