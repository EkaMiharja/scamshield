# ScamShield Hub

Platform deteksi & pelaporan scam **100% client-side** — dibangun dengan Vanilla HTML, CSS, dan JavaScript murni untuk **SDG Tech Switch Fest**.

> **SDG 9 — Industry, Innovation & Infrastructure**: Keamanan digital adalah infrastruktur dasar bagi industri dan inovasi. ScamShield Hub membuktikan bahwa perlindungan siber dapat berjalan tanpa server, tanpa mengirim data, dan tetap transparan bagi pengguna.

## Fitur

- **Pill Navbar** — navigasi kapsul mengambang, sticky, dan drawer menu di mobile
- **Hero Scanner** — analisis URL instan dengan tombol preset demo (Safe / Phishing / Suspicious)
- **Analysis Dashboard** — SVG Trust Score gauge animasi (0–100), Security Checklist, dan rekomendasi yang menyesuaikan hasil analisis
- **Analisis Sentry AI** — narasi hasil pemeriksaan dari Gemini; skor Trust baru ditampilkan setelah AI selesai menjawab (skor gabungan heuristik + AI)
- **Community Threat Feed** — kartu laporan scam dengan badge status, filter real-time, penanda waktu, dan tombol **Scan Link** yang otomatis memperbarui status berdasarkan hasil scan
- **Report Scam Form** — formulir pelaporan dengan validasi client-side, tersimpan ke `localStorage`, dan langsung masuk ke Threat Feed
- **Meta-Light Design System** — mengikuti `DESIGN.md` (canvas putih, tombol pill, corner 32px, permukaan flat dengan hairline border)

## Cara Menjalankan

Tidak ada dependency, build tool, atau server.

1. Double-click `index.html`
2. Atau buka lewat browser: `File > Open File`

Semua fitur berfungsi penuh secara offline (font akan jatuh ke `system-ui` bila tanpa internet).

**Fitur Chat AI (Gemini)** butuh backend proxy karena API key disimpan di server:

- **Lokal**: `GEMINI_API_KEY=xxx GEMINI_MODEL=gemini-3.5-flash-lite node server/server.js` (atau isi `server/.env`), lalu chat di `index.html`.
- **Vercel**: deploy repositori ini; set env `GEMINI_API_KEY` di Vercel. Frontend statis di-serve Vercel, `api/chat.js` menjadi serverless function `/api/chat`. `.env` lokal tidak ikut ter-deploy.

## Struktur Proyek

```
scamshield-hub/
├── index.html           # Single Page Application entry
├── css/
│   └── style.css        # Theme variables, layout, gauge & animasi
├── js/
│   ├── app.js           # SPA router, dashboard render, feed, form, chat AI, toast
│   ├── scanner.js       # Mesin heuristik URL + perhitungan Trust Score
│   ├── storage.js       # Manager localStorage + seed data
│   ├── gauge.js         # Renderer SVG trust score ring
│   ├── gemini.js        # Klien Gemini (chat + analisis URL via proxy)
│   └── sections/        # Template HTML per-section (scanner, dashboard, feed, report, ai)
├── server/
│   └── server.js        # Backend proxy Gemini lokal (Node murni, opsional)
├── api/
│   └── chat.js          # Serverless function chat untuk Vercel (opsional)
├── assets/
│   ├── favicon.svg
│   └── favicon.ico
├── vercel.json
├── package.json
└── README.md
```

## Mesin Analisis (scanner.js)

Pemeriksaan heuristik yang dijalankan seluruhnya di peramban:

- Validasi protokol **HTTPS**
- Deteksi host berupa **alamat IP**
- Evaluasi **Top-Level Domain** berisiko (`.xyz`, `.top`, `.tk`, `.click`, dll.)
- Panjang domain, kedalaman subdomain, dan pola hyphen
- Deteksi **typosquatting** — kemiripan dengan 70+ merek terkenal (bank, e-wallet, e-commerce, media sosial) lewat pencocokan kata tersisip dan edit-distance untuk typo halus (mis. `g00gle`, `facbook-login`)
- Deteksi **indikasi judi online** — 140+ kata kunci slot/togel/casino/situs judi ternama (mis. `dewahoki`, `sbobet`, `poker88`)
- Pencocokan **kata kunci phishing** (login, verify, free, prize, dll.)
- Deteksi kredensial/query mencurigakan pada URL

Skor Trust (0–100) diklasifikasikan menjadi **SAFE** (hijau), **SUSPICIOUS** (amber), dan **DANGER** (merah).

## Status Laporan

Laporan baru berstatus **Sedang Ditinjau**. Status dapat berubah hanya melalui tombol **Scan Link** di tiap kartu feed — status mengikuti skor final (heuristik + AI):

| Hasil scan        | Status laporan    |
| ----------------- | ----------------- |
| AMAN              | Sudah Tuntas      |
| MENURIGAKAN       | Mencurigakan      |
| BERBAHAYA         | Terbukti Penipuan |

## Roadmap (Fase Berikutnya)

Arsitektur modular dirancang agar **Gemini API** dapat di-attach sebagai modul AI tambahan tanpa mengubah mesin inti — mempertahankan 100% transparansi dan *explainability*.

## Legal

Hasil analisis bersifat indikatif berbasis aturan heuristik, bukan jaminan keamanan mutlak. Selalu verifikasi melalui kanal resmi. Semua data tersimpan lokal di perangkat pengguna.
