# AGENTS.md

## Proyek
- `scamshield-hub/` — SPA deteksi scam **Vanilla HTML/CSS/JS murni**. Tanpa npm, tanpa build tool, tanpa server. Verifikasi dengan membuka `scamshield-hub/index.html` langsung di browser; tidak ada lint/test/typecheck.
- Spesifikasi ada di induk direktori proyek: `PRD.md`, `Task.md`, `Guideline.md`, `DESIGN.md`.

## Tugas aktif: redesign UI
- Tampilan saat ini mengikuti `Guideline.md` (tema dark-cyber `#0B0F17`/`#0EA5E9`) yang membuat UI terlihat "generik AI". Ganti agar mengikuti **`DESIGN.md`** (design system Meta): canvas putih, tombol pill hitam + pill cobalt `#0064E0` untuk CTA, corner 32px, tipografi Optimistic VF (fallback Montserrat/Helvetica/Arial), permukaan flat dengan hairline border, elevation minim.
- Redesign **hanya UI** — jangan ubah logika `scanner.js`/`storage.js`. Pertahankan struktur DOM, ID, dan class yang direferensikan JS.
- Status: redesign sudah diterapkan (tema terang Meta-light). Satu tambahan fitur aktif: section **AI Asisten** menggantikan SDG Impact.

## Chat AI (Gemini) & backend proxy
- Section `#ai-section` (template di `js/sections/ai-section.js`) adalah chat dengan Gemini. Logika chat di `app.js` (blok `/* Chat AI */`); modul klien `js/gemini.js` mengirim `POST { messages: [{role, content}] }` ke `/api/chat` (relatif, fallback `http://localhost:3000/api/chat`).
- **API key TIDAK boleh ada di frontend.** Dua opsi backend, pilih salah satu:
  - **Lokal / dev**: `server/server.js` (Node murni tanpa npm), baca env `GEMINI_API_KEY` (bisa lewat `server/.env` yang di-`gitignore`). Jalankan: `GEMINI_API_KEY=xxx GEMINI_MODEL=gemini-flash-latest node server/server.js`.
  - **Vercel**: `api/chat.js` (serverless function) membaca env `GEMINI_API_KEY` dari Vercel Environment Variables. Hapus `server/` dari daftar file biasa (Vercel tidak menjalankannya); `.env` lokal TIDAK ikut ke Vercel.
- Model default: `gemini-flash-latest` (kalau ganti, set `GEMINI_MODEL` di env masing-masing). `gemini-2.0-flash` dan `gemini-2.5-flash` sudah deprecated oleh Google.
- Catatan: aplikasi utama tetap buka via double-click `index.html` tanpa server; chat AI hanya hidup saat proxy backend berjalan (lokal atau di Vercel).

## Warna token: 3 tempat harus sinkron
1. CSS custom properties di `css/style.css` `:root`
2. `js/gauge.js` `colorFor()` — warna risk hardcoded (`#10B981`/`#F59E0B`/`#EF4444`); sebaiknya dipindah ke CSS variable saat redesign
3. `<meta name="theme-color">` di `index.html` (masih `#0B0F17`)

Pemetaan risk mengikuti token semantic DESIGN.md: SAFE → success `#31a24c`, SUSPICIOUS → warning `#f7b928`, DANGER → critical `#e41e3f`.

## Arsitektur JS & urutan load
- Script dimuat sebagai `<script>` biasa di `index.html`, **bukan ES modules** (Task.md menulis "ES6 Modules" tapi realitasnya pola IIFE-global). Urutan wajib: `storage.js` → `scanner.js` → `gauge.js` → `gemini.js` → `sections/*-section.js` → `app.js`. File JS baru harus ditambahkan di urutan yang benar.
- Global yang dipakai bersama: `storage`, `scanner`, `gauge`, `gemini`, `sections` (registry template per-section); `app.js` (IIFE) mengkonsumsinya.

## Kontrak modul
- `scanner.analyzeUrl(url)` → `{ url, host, score (0–100), risk ("SAFE"|"SUSPICIOUS"|"DANGER"), checks[], indicators[], recommendation }`. Item `checks` memiliki `status: "pass"|"warn"|"fail"`.
- `gauge.render(container, score, risk)` — render SVG ring.
- `storage` memakai key localStorage `scamshield_reports_v1`; `getReports()` meng-seed 6 laporan demo saat kosong. Jangan hapus seed / format data.

## Class hooks yang dipakai JS (jangan dihapus saat restyle)
- `app.js` menghasilkan: `.badge-safe/.badge-warning/.badge-danger`, `.check-row/.check-icon/.check-{safe|warning|danger}`, `.threat-item/.threat-{danger|warning|clean}`, `.gauge-card.risk-{safe|warning|danger}`, `.feed-card`, `.btn-ghost`, `.btn-primary`.
- `gauge.js`: `.gauge-track`, `.gauge-fill`, `.gauge-value`, `.gauge-status`, `.gauge-center`.
- Jika mengganti nama class di CSS, update juga string template yang bersangkutan di `app.js`/`gauge.js`.

## Konten & aksesibilitas
- Semua salinan UI berbahasa **Indonesia** — pertahankan kecuali diminta.
- Footer menautkan `../PRD.md`, `../Task.md`, `../Guideline.md`, `README.md`.
- Aksesibilitas tetap wajib walau tema berganti: kontras tinggi, fokus visible, semantic HTML, navigasi keyboard.
